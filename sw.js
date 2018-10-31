var cache_storage_key = 'v1';
var cache_list = [
	'/',
	'/javascripts/jquery-1.12.0.min.js',
	'/javascripts/socket.io.js'
];

self.addEventListener('install',function(event){
	event.waitUntil(
		caches.open(cache_storage_key).then(function(cache){
			return cache.addAll(cache_list);
		})
	)
});

self.addEventListener('fetch',function(event){
	event.respondWith(
		caches.open(cache_storage_key).then(function(cache){
			return cache.match(event.request).then(function(response){
				var fetch_promise = fetch(event.request).then(function(network_res){
					cache.put(event.request,network_res.clone());
					return network_res;
				})
				return response || fetch_promise;
			})
		})
	)
});

self.addEventListener('message',function(event){
	console.log("sw received message" + event.data);

	self.clients.matchAll().then(client_list => {
		client_list.forEach(client => {
			client.postMessage('hi,I am send from service worker!');
		})
	});
});