#!/usr/bin/python

import BaseHTTPServer
import SimpleHTTPServer
import ssl

PORT = 8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = BaseHTTPServer.HTTPServer(('localhost', PORT), Handler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile='./server.pem', server_side=True)

url = 'https://localhost:{port}'.format(port=PORT)
print "serving at port", PORT
print "go to default browser and put: {url}".format(url=url)
httpd.serve_forever()
