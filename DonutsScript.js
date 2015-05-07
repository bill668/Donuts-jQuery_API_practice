var Donuts = window.Donuts  || {};


(function($){    
    'use strict';

    var apiURL = 'http://iam.colum.edu/jon.petto/donuts/api.php';

    // get references to the form fields
    var $name   = $('#name');
    var $email  = $('#email');
    var $review = $('#review');

    
    var $moreDonuts = $('#more-donuts');

    // get reference to cart conter
    var $product        = $('.product');
    var $allProduct     = $('#all-products');
    var $countDisplay   = $('#cart-item-count');


    // get a reference to the submit review button
    var $button1 = $('#submit-review');
    // get a reference to the load more doughunts button
    var $button2 = $('#load-more-donuts');


    // add a click listener to the submit review button
    $button1.on('click', function(event) 
    {
        event.preventDefault();
        console.log('Joooo');

        // create an object literal to hold all the banner properties
        var inputProps = {};

        // populate the object with data from the form fields
        inputProps.name   =  $name.val();
        inputProps.email  =  $email.val();
        inputProps.review =  $review.val();

        // call the function to actually create the Review if all three fields has something written down, then clear the boxes.
        if (inputProps.name !== "" && inputProps.email !== "" && inputProps.review !== "") 
        {
           disPlayReview(inputProps);
           $name.val("");
           $email.val("");
           $review.val("");
        }
    });

    // write a function to create a review
    var disPlayReview = function(props)
    {
        var $reviewDisplay = $('<li class="review hidden">' +
                            '<p>' + props.review + '</p>' +
                            '<a href="mailto:' + props.email + '" >' + props.name + '</a>' +
                             '</li>');
       
       $('#sidebar-review-list').prepend($reviewDisplay);
       $reviewDisplay.slideDown('slow');
    };

    // add a click listener to the submit review button
    $button2.on('click', function(event) 
    {

        // make sure "more dounts" won't display yet
        $moreDonuts.slideToggle("fast");

        // call display function to create each dount
        $.getScript(apiURL+'?action=more_donuts&callback=Donuts.displayDonuts');

        $moreDonuts.addClass('hidden');

        // display more dounts
        $moreDonuts.slideToggle("slow");

        
        // slide the button up
        $button2.slideUp('fast', function() {
            // after slideUp finishes, remove the button
            $button2.remove();
        });
    });

    // display more donuts and remove the button
    Donuts.displayDonuts = function(data)
    {
        for (var i = 0; i < data.donuts.length; i++) 
        {

           // create sub element of each dounts.
           var $li = $('<li>');
           var $a = $('<a>');
           var $figure = $('<figure>');
           var $img = $('<img>');
           var $figcaption =('<figcaption class="product-caption">' + data.donuts[i].name + '</figcaption>');

            //setting  <img>
            $img.attr('src',data.donuts[i].image);


            //setting  <figure>
            $figure.addClass('product-image');
            $figure.append($img).append($figcaption);

            // setting  <a>
            $a.addClass('product');
            $a.attr('href', '#');
            $a.attr('data-donut-id', data.donuts[i].id);
            $a.attr('data-donut-name', data.donuts[i].name);
            $a.append($figure);

            //setting  <li>
            $li.addClass('product-item');
            $li.append($a);

            //append($li)
            $moreDonuts.append($li);
            
        }
    };

    var count = 0;
    $allProduct.on('click', '.product', function(e)
    {
        e.preventDefault();

        var $this = $(this);
        var $parent = $this.closest('a');

        /* change color when img been click(by add product-selected class),
         counting how many donuts was clicked in Cart*/
        $this.toggleClass('product-selected');

        // update the number of donuts been clicked
        if ($parent.hasClass('product-selected')) 
        { 
            count++;
        }
        else  if(!$parent.hasClass('product-selected'))
        {
            count --;
        }

        // display count in cart
        $countDisplay.text(count);


        /*display the name of the donut clicked in Cart */
        // Create a <li> with clicked donut information
        var $cartItemDisplay = $('<li id="cart-item-' + $this.data('donutId') +'" class="hidden ">' +
                                 $this.data('donutName') +'</li>');


        // Check if the donut has already been selected, if not, add it into Cart list
        if(!$('#cart').find('li').is('#cart-item-'+$this.data('donutId')))
        {
          $('#cart').append($cartItemDisplay);
          $cartItemDisplay.slideToggle();
        }
        else
        {
          //When a product is de-selected it should slide up and remove itself from the cart list
            $('#cart-item-' + $this.data('donut-id')).slideUp('fast', function() {
                $(this).remove();
            });                
        }
    });



})(window.jQuery, window.Donuts);
