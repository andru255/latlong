#!/usr/bin/python

# taken from http://www.piware.de/2011/01/creating-an-https-server-in-python/
# generate server.pem with the following command:
#    openssl req -new -x509 -keyout key.pem -out server.pem -days 365 -nodes
# run as follows:
#    python3 simple-https-server.py
# then in your browser, visit:
#    https://localhost:8000

from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
import ssl

HOSTNAME = 'localhost'
PORT = 8000

httpd = HTTPServer(('localhost', PORT), SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile='./server.pem', server_side=True, keyfile="key.pem")

url = 'https://{hostname}:{port}'.format(hostname=HOSTNAME, port=PORT)
print ( "serving at port", PORT )
print ( "go to default browser and put: {url}".format(url=url) )

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass

httpd.server_close()
