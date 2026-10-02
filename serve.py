"""Run with Python 3: python serve.py. No additional packages required."""
import http.server,pathlib,functools,webbrowser
ROOT=pathlib.Path(__file__).resolve().parent
handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT))
server=http.server.ThreadingHTTPServer(('127.0.0.1',8600),handler)
print('SIL860 viewer: http://127.0.0.1:8600')
webbrowser.open('http://127.0.0.1:8600')
try:server.serve_forever()
except KeyboardInterrupt:server.server_close()
