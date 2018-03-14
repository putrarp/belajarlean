Getting started
===============

To insert the game in your page you should follow these simple steps:

1. Load the stylesheet in the document <head>
2. Include the <crossword> tag in your document
3. Use the src attribute of the crossword tag to specify the clue list
4. Load the game script before the </body>

.. code-block:: html
    
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <!-- NOTE: INCLUDE THIS -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <!-- 1) Load the stylesheet -->
            <link rel="stylesheet" type="text/css" href="style/style.css">
        </head>
        <body>

        <!-- ...more content here -->

        <!-- 2) the <crossword> tag -->
        <crossword src="path/to/clue-list"></solitaire>

        <!-- 3) Load the game script -->
        <script src="build/crossword.js"></script>
        </body>
    </html>

You can see the available options :doc:`here </configuration>`.

Change the admin username and password
--------------------------------------

Before start using this script you need to change the username and password:

.. code-block:: php

    <?php
    /* admin/include/config.php */
    $config['username'] = "some-user-name";

    $config['password'] = "My-$uper_SeCure-pa$sw0rd>·%";
    

Now you can start creating crosswords, just go to the admin page `http://<domain>/<install-dir>/admin/`,
after login, click on "create crossword" and start adding words and clues.
