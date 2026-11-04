<?php
/**
 * RED Project — contact form endpoint.
 *
 * This is the ONLY server-side code on redproject.id. It has no database, accepts no
 * file uploads and loads no libraries. It validates a brief, applies spam and rate
 * limits, and emails the brief to RECIPIENT through the hosting provider's mailer.
 *
 * Works with PHP 7.4+. Responds with JSON when the request sends
 * "Accept: application/json" (the site's JS does), otherwise redirects.
 */

// ---- Configuration ------------------------------------------------------------
const RECIPIENT    = 'info@redproject.id';     // where briefs are delivered
const FROM_ADDRESS = 'no-reply@redproject.id'; // must be a mailbox/alias on this domain (SPF/DKIM)
const FROM_NAME    = 'redproject.id';
const ALLOWED_ORIGINS = ['https://redproject.id', 'https://www.redproject.id'];
const RATE_LIMIT   = 5;     // submissions per IP...
const RATE_WINDOW  = 3600;  // ...per hour
const MIN_SECONDS  = 3;     // humans take longer than this to fill the form
// --------------------------------------------------------------------------------

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

$wantsJson = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function respond(int $status, bool $ok, string $error = ''): void
{
    global $wantsJson;
    http_response_code($status);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    } else {
        header('Location: ' . ($ok ? '/thank-you/' : '/contact/?error=1'), true, 303);
    }
    exit;
}

function field(string $key, int $max): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    if (function_exists('mb_substr')) {
        $value = mb_substr($value, 0, $max, 'UTF-8');
    } else {
        $value = substr($value, 0, $max);
    }
    return $value;
}

function oneLine(string $value): string
{
    // Strip CR/LF and other control characters so nothing can inject mail headers.
    return trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '');
}

function encodeHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

// 1. Method and origin --------------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Method not allowed.');
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ALLOWED_ORIGINS, true)) {
    respond(403, false, 'Requests from this origin are not accepted.');
}

// 2. Spam traps (pretend success so bots learn nothing) ------------------------------
if (field('website', 200) !== '') {
    respond(200, true);
}
$ts = (int) field('ts', 20);
if ($ts > 0 && (time() - $ts) < MIN_SECONDS) {
    respond(200, true);
}

// 3. Rate limit per IP (hashed, stored in the system temp dir) -----------------------
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = rtrim(sys_get_temp_dir(), '/\\') . '/rp_contact_' . hash('sha256', $ip . __FILE__);
$now = time();
$hits = [];
$fh = @fopen($bucket, 'c+');
if ($fh !== false) {
    flock($fh, LOCK_EX);
    $raw = stream_get_contents($fh);
    $decoded = json_decode($raw ?: '[]', true);
    if (is_array($decoded)) {
        $hits = array_values(array_filter($decoded, static function ($t) use ($now) {
            return is_int($t) && $t > $now - RATE_WINDOW;
        }));
    }
    if (count($hits) >= RATE_LIMIT) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond(429, false, 'Too many messages from your connection. Please try again later or reach us on WhatsApp.');
    }
    $hits[] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
}

// 4. Validate ----------------------------------------------------------------------
$name     = oneLine(field('name', 100));
$company  = oneLine(field('company', 120));
$email    = oneLine(field('email', 160));
$phone    = oneLine(field('phone', 30));
$interest = oneLine(field('interest', 100));
$message  = field('message', 4000);
$consent  = field('consent', 5);

$errors = [];
if ($name === '') {
    $errors[] = 'your name';
}
if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors[] = 'a valid email address';
}
if ((function_exists('mb_strlen') ? mb_strlen($message, 'UTF-8') : strlen($message)) < 10) {
    $errors[] = 'a short message (at least 10 characters)';
}
if ($phone !== '' && !preg_match('/^[0-9+()\-\s.]{6,30}$/', $phone)) {
    $errors[] = 'a valid WhatsApp number (or leave it empty)';
}
if ($consent !== 'yes') {
    $errors[] = 'your consent to be contacted';
}
if ($errors) {
    respond(422, false, 'Please check ' . implode(', ', $errors) . '.');
}

// 5. Send --------------------------------------------------------------------------
$subject = 'New brief from ' . $name . ($company !== '' ? ' (' . $company . ')' : '');
$body = implode("\n", [
    'A new brief was sent through redproject.id/contact.',
    '',
    'Name:      ' . $name,
    'Company:   ' . ($company !== '' ? $company : '-'),
    'Email:     ' . $email,
    'WhatsApp:  ' . ($phone !== '' ? $phone : '-'),
    'Interest:  ' . ($interest !== '' ? $interest : 'Not sure yet'),
    '',
    'Message:',
    str_replace(["\r\n", "\r"], "\n", $message),
    '',
    '---',
    'Sent: ' . gmdate('Y-m-d H:i') . ' UTC',
    'Reply directly to this email to answer the sender.',
]);

$headers = implode("\r\n", [
    'From: ' . encodeHeader(FROM_NAME) . ' <' . FROM_ADDRESS . '>',
    'Reply-To: ' . encodeHeader($name) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: redproject.id contact form',
]);

$sent = @mail(RECIPIENT, encodeHeader($subject), $body, $headers, '-f' . FROM_ADDRESS);
if (!$sent) {
    error_log('[redproject contact] mail() returned false');
    respond(500, false, 'We could not send your message right now. Please reach us on WhatsApp or email ' . RECIPIENT . '.');
}

respond(200, true);
