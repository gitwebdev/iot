document.getElementById("brockerName").value = 'localhost';
document.getElementById("brockerPort").value = 15674;
document.getElementById("Message").value = 30;
document.getElementById("Queue_producer").value = 'stomp_input';
document.getElementById("Queue_consumer").value = 'red_node_output';

var ws, client;
	
function brocker_connection() {

	ws = new SockJS('http://' + document.getElementById("brockerName").value + ':' + document.getElementById("brockerPort").value + '/stomp');
	client = Stomp.over(ws);

	var on_connect = function() {
		console.log('connected');
	};

	var on_error =  function() {
		console.log('error');
	};
	
	client.connect('iot_user', '111111', on_connect, on_error, '/iot_vhost');
	
}

function send_message() {

	var msg = document.getElementById("Message").value;
	
	queue = document.getElementById("Queue_producer").value;
	
	client.send(queue, {priority: 9}, msg);
}

function read_message() {

	var callback = function(message) {
    // called when the client receives a STOMP message from the server
		if (message.body) {
			document.getElementById("Result").value = message.body
		} else {
			alert("got empty message");
		}
	};
	
	queue = document.getElementById("Queue_consumer").value;
	
	client.subscribe(queue, callback);
	
}