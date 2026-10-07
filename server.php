<?php

$uri = urldecode(
    (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? ''
);

if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    $filePath = __DIR__ . '/public' . $uri;
    $isGet  = ($_SERVER['REQUEST_METHOD'] ?? '') === 'GET';
    $isHead = ($_SERVER['REQUEST_METHOD'] ?? '') === 'HEAD';

    if ($isGet || $isHead) {
        $mtime = filemtime($filePath);
        $size  = filesize($filePath);

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($filePath);
        if ($mimeType === false) {
            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $mimeType = match ($ext) {
                'glb'  => 'model/gltf-binary',
                'gltf' => 'model/gltf+json',
                'bin'  => 'application/octet-stream',
                'jpg', 'jpeg' => 'image/jpeg',
                'png'  => 'image/png',
                'webp' => 'image/webp',
                'css'  => 'text/css',
                'js', 'mjs' => 'application/javascript',
                'json' => 'application/json',
                'svg'  => 'image/svg+xml',
                'woff' => 'font/woff',
                'woff2' => 'font/woff2',
                'ttf'  => 'font/ttf',
                default => 'application/octet-stream',
            };
        }

        $lastModified = gmdate('D, d M Y H:i:s', $mtime ?: time()) . ' GMT';

        $rangeHeader = $_SERVER['HTTP_RANGE'] ?? '';
        $hasRange = is_string($rangeHeader) && str_starts_with(strtolower($rangeHeader), 'bytes=');

        header('Accept-Ranges: bytes');
        header('Last-Modified: ' . $lastModified);
        header('Content-Type: ' . $mimeType);
        header('X-Content-Type-Options: nosniff');

        $etag = '"' . dechex($size) . '-' . dechex($mtime) . '"';
        header('ETag: ' . $etag);

        $protocol = $_SERVER['SERVER_PROTOCOL'] ?? 'HTTP/1.1';
        if (!$hasRange) {
            // ⚠️ KHUSUS METHOD HEAD: JANGAN SET Content-Length (Chromium fetch HEAD anggap
            // server akan kirim body sebesar Content-Length → close tanpa body → ERR_ABORTED).
            // Accept-Ranges + ETag + Last-Modified sudah cukup utk GLTFLoader detect range-capable server.
            if ($isGet) {
                header('Content-Length: ' . $size);
            }
            header($protocol . ' 200 OK', true, 200);
            if ($isGet) {
                readfile($filePath);
            }
            return true;
        }

        $rangeSpec = substr($rangeHeader, strlen('bytes='));
        [$rangeStart, $rangeEnd] = array_pad(explode('-', $rangeSpec, 2), 2, '');

        if ($rangeStart === '' && $rangeEnd === '') {
            header($protocol . ' 416 Range Not Satisfiable', true, 416);
            if ($isGet) {
                header('Content-Range: bytes */' . $size);
            }
            return true;
        }

        if ($rangeStart === '') {
            $suffixLen = (int) $rangeEnd;
            if ($suffixLen <= 0) {
                header($protocol . ' 416 Range Not Satisfiable', true, 416);
                if ($isGet) {
                    header('Content-Range: bytes */' . $size);
                }
                return true;
            }
            $start = max(0, $size - $suffixLen);
            $end   = $size - 1;
        } else {
            $start = (int) $rangeStart;
            $end   = ($rangeEnd === '' || $rangeEnd === null) ? ($size - 1) : (int) $rangeEnd;
        }

        if ($start > $end || $start < 0 || $end >= $size) {
            header($protocol . ' 416 Range Not Satisfiable', true, 416);
            if ($isGet) {
                header('Content-Range: bytes */' . $size);
            }
            return true;
        }

        $length = $end - $start + 1;

        // KHUSUS METHOD HEAD dengan Range request:
        // JANGAN set 206 status / Content-Range / Content-Length → Chromium fetch HEAD
        // akan ABORT jika Content-Length di-set dan tidak ada body.
        // Cukup 200 OK dengan Accept-Ranges + ETag (server capability detected).
        if (!$isGet) {
            header($protocol . ' 200 OK', true, 200);
            return true;
        }

        header($protocol . ' 206 Partial Content', true, 206);
        header('Content-Range: bytes ' . $start . '-' . $end . '/' . $size);
        header('Content-Length: ' . $length);

        $handle = fopen($filePath, 'rb');
        if ($handle === false) {
            header($protocol . ' 500 Internal Server Error', true, 500);
            return true;
        }

        if ($start > 0) {
            fseek($handle, $start);
        }

        $remaining = $length;
        $chunkSize = 1024 * 1024; // 1MB chunks
        while ($remaining > 0 && !feof($handle)) {
            $readSize = min($chunkSize, $remaining);
            $data = fread($handle, $readSize);
            if ($data === false) break;
            echo $data;
            flush();
            $remaining -= strlen($data);
        }
        fclose($handle);
        return true;
    }

    return false;
}

require_once __DIR__ . '/public/index.php';
