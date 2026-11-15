#!/usr/bin/env python3
"""Double-fork daemonizer: survives call-boundary reapers that kill
session leaders / process groups. Usage: daemonize.py CMD [ARGS...]"""
import os, sys
if os.fork():
    sys.exit(0)                    # parent returns to shell
os.setsid()                        # new session (this child is its leader)
if os.fork():
    sys.exit(0)                    # intermediate exits; grandchild is non-leader
os.execvp(sys.argv[1], sys.argv[1:])
