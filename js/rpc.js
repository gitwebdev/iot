document.getElementById("brockerName").value = "localhost";
document.getElementById("brockerPort").value = 15674;
document.getElementById("userName").value = "iot_user";
document.getElementById("userPWD").value = "111111";
document.getElementById("vhost").value = "/iot_vhost";
document.getElementById("squeue").value = "/queue/iot_queue";
document.getElementById("sreplyto").value = "/reply-queue/";

var ws, client, id;
	
function brocker_connection() {

	ws = new SockJS('http://' + document.getElementById("brockerName").value + ':' + document.getElementById("brockerPort").value + '/stomp');
	client = Stomp.over(ws);
	
	// SockJS does not support heart-beat: disable heart-beats
	client.heartbeat.incoming = 0;
	client.heartbeat.outgoing = 0;

	client.debug = function(e) {
		$('#second div').append($("<code>").text(e));
	};
	
	// default receive callback to get message from temporary queues
	client.onreceive = function(m) {
		$('#first div').append($("<code>").text(m.body));
	}
	
	var on_connect = function(x) {

	};

	var on_error = function() {
		console.log('error');
	};
	
	client.connect('iot_user', '111111', on_connect, on_error, '/iot_vhost');
	
	$('#first form').submit(function() {
		var text = $('#first form input').val();
		if (text) {
			queueName = document.getElementById("squeue").value;
			replytoQueueName = document.getElementById("sreplyto").value;
			client.send(queueName, {'reply-to': replytoQueueName}, text);
			$('#first form input').val("");
		}
		return false;
	});
	
} // function brocker_connection()

function subscribe() {

	queueName = document.getElementById("rqueue").value;
	
	id = client.subscribe(queueName, function(m) {
		// reply by sending the reversed text to the temp queue defined in the "reply-to" header
		var reversedText = m.body.split("").reverse().join("");
		client.send(m.headers['reply-to'], {"content-type":"text/plain"}, reversedText);
	});

} // function subscribe()

function unsubscribe(id) {

	client.unsubscribe(id.value);

} // function unsubscribe()