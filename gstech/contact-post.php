
<!DOCTYPE HTML>
<html>
<head>
<title>GS TECHNOLOGY</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700,800,600,300' rel='stylesheet' type='text/css'>
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" media="all" />
<link href="css/bootstrap-theme.min.css" rel="stylesheet" type="text/css" media="all" />
<link href="css/style.css" rel="stylesheet" type="text/css" media="all" />
<link href="css/font-awesome.css" rel="stylesheet" type="text/css" media="all" />
<link href="css/carousel.css" rel="stylesheet" type="text/css" media="all" />
<link href="css/owl.carousel.css" rel="stylesheet" type="text/css" media="all" />
<script src="js/jquery-1.10.2.min.js" type="text/javascript"></script>
<script src="js/bootstrap.js" type="text/javascript"></script>
<script src="js/bootstrap.min.js" type="text/javascript"></script>
<script src="js/owl.carousel.js" type="text/javascript"></script>
  <script>
    $(document).ready(function() {

      var owl = $("#owl-demo");

      owl.owlCarousel({

      items :4, //10 items above 1000px browser width
      itemsDesktop : [1000,4], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,3], // 3 items betweem 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0;
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
      
      });

      // Custom Navigation Events
      $(".next").click(function(){
        owl.trigger('owl.next');
      })
      $(".prev").click(function(){
        owl.trigger('owl.prev');
      })

    });
    </script>
  <script type="text/javascript">
  // Login Form
	$(function() {
	    var button = $('#loginButton');
	    var box = $('#loginBox');
	    var form = $('#loginForm');
	    button.removeAttr('href');
	    button.mouseup(function(login) {
	        box.toggle();
	        button.toggleClass('active');
	    });
	    form.mouseup(function() { 
	        return false;
	    });
	    $(this).mouseup(function(login) {
	        if(!($(login.target).parent('#loginButton').length > 0)) {
	            button.removeClass('active');
	            box.hide();
	        }
	    });
	});
	</script>
<style>
		h2{
		font-size: 40px;
		font-style:bold;
		margin-top:15px;
		color:white;
		font-family:Georgia, 'Times New Roman', Times, serif;
	}
	body{
		
		background-image: url("images/bgc.gif");
	} 
	
	#hd{
		width: 100%;
		height: 100%;
		padding-top: 20px;	
	}
	.lgimg{
	height: 70px;
			width: 45px;
			margin-top: 17px;
			margin-right: 10px;
}
#foot{
			background:#F28858;
		}
		.subscribe{
			padding-left:350px;
		}
	#con{
		color:white;
	}
#cont{
	color:white;
}

#mb{
		color:deeppink;
	}
	#mbs{
		color:deeppink;
	}
	#ic{
		color:deeppink;
	}
	#ics{
		color:deeppink;
	}
	</style>
</head>
<body>
   <!-- Start Header -->
             <div class="header-logo-nav">
             	  <div class="navbar navbar-inverse navbar-static-top nav-bg" role="navigation">
				      <div class="container">
				        <div class="navbar-header">
				          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
				            <span class="sr-only">Toggle navigation</span>
				            <span class="icon-bar"></span>
				            <span class="icon-bar"></span>
				            <span class="icon-bar"></span>
				          </button>
				         <div class="logo"> <a class="navbar-brand" href="index.html"><img src="images/lg.png" alt="" class="lgimg" /></a></div>
				          <div class="clear"></div>
				        </div>
				        <div class="collapse navbar-collapse"><h2 id="hd">Gs Technology India Pvt Ltd</h2>
				          <ul class=" menu nav navbar-nav">
				            <li ><a href="index.html">Home</a></li>
   					 <li ><a href="about.html">About us</a></li>
					<li><a href="spares.html">Spares</a></li>
		
				            <li class="active"><a href="contact.html">Contact Us</a></li>

				          </ul>
				        </div><!--/.nav-collapse -->
				      </div>
				    </div>
		         <div class="clear"></div>
	        </div>
           </div>
   <!-- End Header -->
   
   <!-- Start Main Content -->
	 <div class="main">	 
	 	<div class="contact about-desc">
   		<div class="container">
   			<div class="row">
   				<div class="col-md-8 contact_left">
   					<h2>We Want to hear from you</h2>
   					<p class="m_6" id="con">For improving our shuttle booking services we want to have the positive and negative feedback. Please help us to improve our services by commenting.</p>
   					<p class="m_7" id="cont">For any queries you can contact us through my mail or call our tollfree number. Fell free to contact and suggest the improvents that are required.Thanks.</p>
   			   <ul class="contact_info">
			  	<li><i class="fa fa-phone" id="ic"></i><span id="mb">Mobile: +91 9994211913<br>Phone: +91 8220082276</span><div class="clear"></div></li>
			  	<li><i class="fa fa-envelope" id="ics"></i><span class="msg"><a id="mbs" href="mailto:gstech81@gmail.com">gstech81@gmail.com</a></span><div class="clear"></div></li>
			   </ul>
   				</div>
   				<div class="col-md-4">
   					<div class="contact_right">
   				<div class="contact-form_grid">
                     <?php
                     
                     $to_email ='gstech81@gmail.com';
                     $subject = $_POST['subj'];
										 $message = $_POST['msg'];
										 $headers = $_POST['email'];
                    mail($to_email,$subject,$message,$headers);
                     echo "Thanks for Enquirey submited,comming soon our team contact us.  ";

										 ?>
										 <a href="index.html">click here</a>
			      </div>
   			     </div>
   				</div>
   			</div>
   		</div>
   	</div>
   	
   </div>
   <!-- End Main Content -->
	   
 <!-- Start Footer -->
  <span class="footer-arrow"></span>
       <div class="footer" id="foot">	  
       	 <div class="wrap">	      
		  <div class="row">
			   <div class="col-lg-6">
			   	<h2>About The Gs Technology</h2>
			   	<p>Gs Technology India Pvt is a registered online spares booking website by the Our Manufacturing Democratic Team. Any issues should be contact Mr.A.GowriShanker,Coimbatore . </p>
			    <ul class="links">
			    	<li><a href="about.html">About</a> /</li>
			    	<li><a href="tc.html">Term of Services</a> </li>
			    	
			    </ul> 
			   </div>
			    <div class="col-lg-6">
			  
			     <div class="products-list">
			     <ul>
			     	
			     </ul>
			     <ul>	                         
			   
			     </ul>
			     <div class="clear"></div>
			    </div>
			     <div class="subscribe">
					 <h2>G.S Technology</h2>
						<p>Plot No. 19,Vallal Nagar,<br>
							Pillayarpuram Sidco Post,<br>
							Coimbatore-641 021.<br>
							Email: gsteh81@gmail.com
						</p>
			    </div>
			   </div>
			  </div>
			 </div>
		   </div>
			 <div class="footer-bottom">
			 	<div class="wrap">
			 	<div class="copy-right">
			 		<p>GS Technology company Copyright &copy; 2019  all right reserved. </p>
			 	</div>
			 	<div class="social-icons">
			 		<ul>
			 			<li><a href="https://twitter.com/Shanker83983952" target="_blank"><i class="fa fa-twitter"></i></a></li>
			 			<li><a href="https://www.facebook.com/Gstechnology-829224147431097/?modal=admin_todo_tour" target="_blank"><i class="fa fa-facebook"></i></a></li>
			 			<li><a href="#"><i class="fa fa-google-plus"></i></a></li>
			 	
			 		</ul>
			 	</div>
			 	<div class="clear"></div>
			 </div>
	       </div>
  <!-- End Footer -->
  </body>
</html>
    	
            