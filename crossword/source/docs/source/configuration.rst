Configuration
=============

There are two attributes you can use to configure your crossword

* **src**: the url to the list of words to use in this crossword
* **msg**: the message that will be show at the end of the game, use **{time}** in your message to display the time used to solve the crossword.

.. code-block:: html

    <crossword src="path/to/word-list" msg="You win"></crossword>

**Note**: alternatively you can load a crossword using the "puzzle" parameter in your url

.. code-block:: html

    http://<domain>/<install-dir>/?puzzle=<your-puzzle-list>

Restrict access to the download feature
---------------------------------------

You may want to allow download of the crosswords only to some of your users.

All you have to do is edit the function **user_can_download_pdf** in download/index.php, by default this function always return True.

**Example**

.. code-block:: php

    <?php
    // download/index.php
    function user_can_download_pdf() {
        return isset($_SESSION["user_is_logged"]) && $_SESSION["user_is_logged"];
    }
