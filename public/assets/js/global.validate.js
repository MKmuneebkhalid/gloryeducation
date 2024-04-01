
$().ready(function() {

    // validate signup form on keyup and submit
    $("#registerForm").validate({
        rules: {
            firstname: "required",
            lastname: "required",
            province: "required",
            address1: "required",
            address2: "required",
            institution: "required",
            password: {
                required: true,
                minlength: 5
            },
            email: {
                required: true,
                email: true
            },
           country: "required",
        },
        messages: {
            firstname: "Please enter your Firstname",
            lastname: "Please enter your Lastname",
            address1: "Please enter first line of official address",
            province:"Address province is required",
            country:"Country is required",
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long"
            },
            email: "Please enter a valid email address",
            institution: "Please select your institution to continue",

        }
    });

    $('#onWebsiteSetup').validate({
        rules: {
            domain: "required",
            messages: {
                domain: "Please enter a site name"
            }
        }
    });

    // Compliance Document Uploader
    $('#onDocSubmit').validate({
        rules: {
            document_type: "required",
            messages: {
                document_type: "Please select the document type"
            }
        }
    });

    $('#loginAuthentication').validate({
        rules: {
            email: {
                required: true,
            },
            password: {
                required: true,
                minlength: 5
            },
            messages: {
                email: "Please enter your Email or Merchant ID",
                password: "Please enter your Password"
            }
        }
    });

    $('#addNewStaff').validate({
        rules: {
            firstname: "required",
            lastname: "required",
            email: {
                required: true,
            },
             messages: {
                 email: "Please enter your email address",
                 firstname: "Please enter your Firstname",
                 lastname: "Please enter your Lastname",
            }
        }
    });

    $('#menuForm').validate({
        rules: {
            product: "required",
            price: "required",
            description: "required",
            status: "required",
            isQuantity: "required",
            isAddon: "required",
            isMenu: "required",
            isGrouped: "required",
            product_type: "required",
            messages: {
                product: "Please enter your product name",
                price: "Price is required for this product",
                description: "Please enter a short description",
                status: "Please specify a status",
                isQuantity: "Please specify if the product has unit quantity",
                isAddon: "Please indicate if this product is a side menu addon",
                isMenu: "Please indicate if it is standalone menu",
                isGrouped: "Please confirm if you wish to group the product into a category.",
            }
        }
    });

    $('#itemForm').validate({
        rules: {
            query: "required",
            messages: {
                product: "Product name is required",
            }
        }
    });

    // Ndew Category
    $('#createCatForm').validate({
        rules: {
            new_cat_name: "required",
            new_status: "required",
            new_cat_description: "required",
            messages: {
                new_cat_name: "Category name is required",
                new_status: "Please specify the status for this category",
                new_cat_description: "Category description is required",
            }
        }
    });




    //code to hide topic selection, disable for demo
    //var newsletter = $("#newsletter");
    // newsletter topics are optional, hide at first

  /*  var topics = $("#newsletter_topics")[inital ? "removeClass" : "addClass"]("gray");
    var topicInputs = topics.find("input").attr("disabled", !inital);
    // show when newsletter is checked
    newsletter.click(function() {
        topics[this.checked ? "removeClass" : "addClass"]("gray");
        topicInputs.attr("disabled", !this.checked);
    });*/
});