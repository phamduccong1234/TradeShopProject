
const socket = io()

const listMessage = $("#list-messages")

const START_CHAT = "START_CHAT";
const START_CHAT_SUCCESS = "START_CHAT_SUCCESS";
const GET_MESSAGE = "GET_MESSAGE";
const GET_MESSAGE_SUCCESS = "GET_MESSAGE_SUCCESS";
const NEW_MESSAGE = "NEW_MESSAGE";
const NEW_MESSAGE_SUCCESS = "NEW_MESSAGE_SUCCESS";

function startChat({type, id}){
	socket.emit(START_CHAT, { type, id} )
}

function getMessages() {
	socket.emit(GET_MESSAGE, { room_id: current_room_id })
}

function newMessage(body) {
	console.log(body)
	socket.emit(NEW_MESSAGE, {
		room_id: current_room_id,
		body: body
	})
}


function renderMessage(mess, append = true) {
	console.log(append)
	const html = `<li class="${mess.author_id === current_user_id ? `replies` : `sent`}">
			<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
			<p>${mess.body}</p>
		</li>`;

	if (append) {
		listMessage.append(html)
	} else {
		listMessage.prepend(html)
	}
}

function renderContactProfile(user) {
	const html = `<img src="/assets/client/images/User/${user.user_img}" alt="" style="height: 50px;width: 50px">
	<p>${user.user_name}</p>`;

	$(".contact-profile").html(html)
}


startChat({type: "room", id: current_room_id});

socket.on(START_CHAT_SUCCESS, function ({room}) {
	current_room_id = room._id;
	$("#contacts").find(".active").removeClass("active")
	listMessage.empty();
	getMessages();
	$(`#${room._id}`).addClass("active");
	const user  = room.users.filter(u => u._id !== current_user_id)[0]
	renderContactProfile(user)
});

socket.on(GET_MESSAGE_SUCCESS, function ({messages}) {
	if (messages.length) {
		for (let mess of messages) {
			renderMessage(mess, false)
		}
	}
});

socket.on(NEW_MESSAGE_SUCCESS, function ({mess}) {
	if (mess.room_id === current_room_id) {
		renderMessage(mess)
	}
	
})

$("input#input_send_mess").on("keyup", function (e) {

	if (e.keyCode === 13){
		const value = $(this).val();
		$(this).val("")
		newMessage(value)
	}
})


$(document).ready(function(){
	$(document).on("click", ".contact", function(e){
		const self =$(this);
		const id = self.attr("id")
		startChat({type: "room", id})
	})
})





























$(".messages").animate({ scrollTop: $(document).height() }, "fast");

$("#profile-img").click(function() {
	$("#status-options").toggleClass("active");
});

$(".expand-button").click(function() {
  $("#profile").toggleClass("expanded");
	$("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function() {
	$("#profile-img").removeClass();
	$("#status-online").removeClass("active");
	$("#status-away").removeClass("active");
	$("#status-busy").removeClass("active");
	$("#status-offline").removeClass("active");
	$(this).addClass("active");
	
	if($("#status-online").hasClass("active")) {
		$("#profile-img").addClass("online");
	} else if ($("#status-away").hasClass("active")) {
		$("#profile-img").addClass("away");
	} else if ($("#status-busy").hasClass("active")) {
		$("#profile-img").addClass("busy");
	} else if ($("#status-offline").hasClass("active")) {
		$("#profile-img").addClass("offline");
	} else {
		$("#profile-img").removeClass();
	};
	
	$("#status-options").removeClass("active");
});

// function newMessage() {
// 	message = $(".message-input input").val();
// 	if($.trim(message) == '') {
// 		return false;
// 	}
// 	$('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
// 	$('.message-input input').val(null);
// 	$('.contact.active .preview').html('<span>You: </span>' + message);
// 	$(".messages").animate({ scrollTop: $(document).height() }, "fast");
// };

// $('.submit').click(function() {
//   newMessage();
// });

// $(window).on('keydown', function(e) {
//   if (e.which == 13) {
//     newMessage();
//     return false;
//   }
// });