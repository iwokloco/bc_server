var nodemailer = require('nodemailer');
var mail_transport = {	host: 'smtp.strato.com', auth: {user: 'webmaster@iwoky.com', pass: '6427ZHE3895'}	};

function sendEmail(req, res){
	try{
		console.log(req.body.name + "," + req.body.mail + "," + req.body.budget + "," + req.body.desc);
		if(req.body.name != undefined && req.body.mail != undefined){
			var transporter = nodemailer.createTransport(mail_transport);
			var mailOptions = {	from: 'webmaster@iwoky.com',
				to: 'iwokloco@gmail.com', // list of receivers
				subject: "Presupuesto - " + req.body.name + " - " + req.body.budget, // Subject line
				html: '<b>Nombre : </b>'+req.body.name+'<br><b>E-mail :</b> '+req.body.mail+'<br><b>Presupuesto :</b> '+req.body.budget + '<br><b>Description : </b>'+req.body.desc
			};
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			        res.json({yo: 'error'});
			    }else{
			        console.log('Message sent: ' + info.response);
			        res.json({yo: info.response});
			    };
			});
		}else{
			res.json({yo:"no_fields"});
		}
	}catch(ex){
		console.log("EX  auth : " + ex);
		res.json(ex);
	}
}



exports.sendEmail = sendEmail;
