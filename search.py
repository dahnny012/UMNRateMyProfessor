import urllib2
import urllib
import threading
from HTMLParser import HTMLParser
import re
import csv
import time
import io,os,sys



class TagStripper(HTMLParser):
	def __init__(self):
		self.reset()
		self.fed = []
		self.group = []
	def handle_starttag(self,tag,attrs):
		# Eventually ill want to handle getting their homepage
	    if tag == "a":
	        return
	def handle_data(self,data):
		self.fed.append(data)
	def get_data(self):
		return " ".join(self.fed)
	def flush_buffer(self):
		self.fed = []


class search():
	def __init__(self,idList=None):
		self.filename = "default"
		self.offset = -20
	def run(self):
		threads = []
		t0 = time.time()
		numThreads = 1
		for id in range(0,numThreads):
			t = threading.Thread(target=self.searchProfs, args=())
			threads.append(t)
			t.start()
		for i in range(0,numThreads):
			threads[i].join()
		print("Finished in: ")
		print time.time() - t0
	def searchProfs(self):
		# this needs a lock
		self.offset += 20
		profs = True
		parser = TagStripper()
		while profs:
			profs = False
			profPage = self.getPage(self.offset)
			profs = self.buildProfTable(profPage,parser);
			# this need a lock
			self.offset += 20
			return

		
	def buildProfTable(self,page,parser):
		#Find each prof
		match = list(re.finditer("<li class=\"listing PROFESSOR\">(.)*</li>",page))
		print(match)
		for prof in match:
			#For each table element strip it and add it to the list
			print("i tried")
			releaseNode = prof.group(0)
			release = self.stripTags(releaseNode,parser)
		return True
		
	def stripTags(self,node,parser):
		parser.feed(node)
		data = parser.get_data()
		print(data)
		parser.flush_buffer()
		return data
	
	def getPage(self,offset):
		url = "http://www.ratemyprofessors.com/search.jsp?query=university+of+minnesota+twin+cities&queryoption=HEADER&stateselect=&country=&dept=&queryBy=&facetSearch=&schoolName=&offset="+str(offset)+"&max=20"
		req = urllib2.Request(url)
		response = urllib2.urlopen(req)
		page = response.read()
		return page

scraper = search()
scraper.run()