#!/usr/bin/env python3
"""One-shot Host-header capture on :3000.

The sandbox front proxy forwards external requests here with the
original Host preserved. Whoever polls the preview while this runs
reveals the public origin. Keeps serving for up to ITER x WAIT seconds,
stops early once at least one Host is captured.
"""
import socketserver
import sys
from datetime import datetime, timezone

WAIT = float(sys.argv[1]) if len(sys.argv) > 1 else 8.0
ITER = int(sys.argv[2]) if len(sys.argv) > 2 else 6
LOG = "/tmp/captured-hosts.log"


class Handler(socketserver.BaseRequestHandler):
    def handle(self):
        data = self.request.recv(4096).decode("utf-8", "replace")
        host = "?"
        first = "?"
        for i, line in enumerate(data.split("\r\n")):
            if i == 0:
                first = line
            if line.lower().startswith("host:"):
                host = line.split(":", 1)[1].strip()
        stamp = datetime.now(timezone.utc).strftime("%H:%M:%S")
        entry = f"{stamp} host={host} req={first}"
        print("CAPTURED:", entry, flush=True)
        with open(LOG, "a") as f:
            f.write(entry + "\n")
        body = b"capture-listener\n"
        self.request.sendall(
            b"HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: "
            + str(len(body)).encode()
            + b"\r\nConnection: close\r\n\r\n"
            + body
        )


class Server(socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


srv = Server(("0.0.0.0", 3000), Handler)
srv.timeout = WAIT
captured = 0
for _ in range(ITER):
    srv.handle_request()  # blocks up to WAIT; returns on request or timeout
    try:
        captured = sum(1 for _ in open(LOG))
    except FileNotFoundError:
        captured = 0
    if captured:
        break
print(f"capture window closed, entries={captured}", flush=True)
