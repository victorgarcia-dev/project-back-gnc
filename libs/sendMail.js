const nodemailer = require('nodemailer');
const fs = require('fs');

const sendMail = ({...mailOptions})=>{
  //TODO: agregar datos de auth al modelo
    var transporter = nodemailer.createTransport({
      port: 587,             
      host: 'outlook.office365.com',
      service: 'smtp.office365.com',
      auth: {
        user: 'osa@redsos.com.ar',
        pass: 'Envio1.3$o$'
      },
      secure: false

    });

    transporter.sendMail({...mailOptions}, function (error, info) {
        console.log('senMail returned!');
        if (error) {
          console.log('error!!!!!!', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

const generateMailDetail = async( taskID, event , insurer) => {
  try{
   
      let mailData = {
          from: 'osa@redsos.com.ar',
          to: [insurer.contact.email,'drivas@redsos.com.ar','jpedron@redsos.com.ar','lsanchez@denwaip.com'],
          subject: `Nuevo sinietro Nº ${zfill(taskID, 6)}`,
          text: 'osa',
          html: cuerpoMail(taskID, event)
      };

      await sendMail({...mailData} );
      return {status:200};
  }
  catch(err){
      console.log('NO PUDE GENERAR EL MAIL POR: ',err);
      return null;
  }
}

const cuerpoMail = ( taskID, event )=>{
  let file = fs.readFileSync(process.cwd() + '/statics/cuerpoMail.html','utf8');
  
  file = file.replace('[%TASKID%]', zfill(taskID, 6));
  file = file.replace('[%PATENTE%]',`${event.data.data.holderData.plate}`);
  file = file.replace('[%DNI%]',event.data.data.holderData.legalId);
  file = file.replace('[%POLIZA%]',event.data.data.holderData.policy);
  file = file.replace('[%TELEFONO%]',event.data.data.holderData.phone);
  file = file.replace('[%MAIL%]',event.data.data.holderData.email);

  //TODO: URL debe pasar a modelo
  file = file.replace('[%URL_SINIESTROS%]',`https://osa.redsos.com.ar/#/sinisters/${event.data.taskId}`);
  return file;
};

function zfill(number, width) {
  let numberOutput = Math.abs(number);
  let length = number.toString().length;
  let zero = '0'; 
  
  if (width <= length) {
      if (number < 0) {
           return ('-' + numberOutput.toString()); 
      } else {
           return numberOutput.toString(); 
      }
  } else {
      if (number < 0) {
          return ('-' + (zero.repeat(width - length)) + numberOutput.toString()); 
      } else {
          return ((zero.repeat(width - length)) + numberOutput.toString()); 
      }
  }
}

const Clave = ( code )=>{
  let file = fs.readFileSync(process.cwd() + '/statics/MailRecupero.html','utf8');
  file = file.replace('[%CODE%]', code);
  return file;
};

module.exports = {sendMail, generateMailDetail, cuerpoMail, Clave};