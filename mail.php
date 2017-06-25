<?php

  // Fetch data from field
  $name =   $_POST['name'];
  $email =  $_POST['email'];
  $msg =    $_POST['msg'];

  // Set the paramters
  $to = "hello@drago.nyc";
  $subject = "Let's talk!";
  $txt = $msg . "\r\n" . "\r\n";
  $txt .= 'Best Regards ' . $name;
  $headers = 'From: Drago Web <webmaster@drago.nyc>' . "\r\n" .
    'Reply-To:' . $email;

  // Send the mail
  mail($to,$subject,$txt,$headers);

  echo $name . $email . $msg;

?>