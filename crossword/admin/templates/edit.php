<?php if (!defined('BASE_PATH')) die("No direct access allowed"); ?>
<div class="col-lg-12">
    <form class="form" role="form" method="post" action="?edit=<?php echo $id; ?>&utf8=✔">
        <?php if (isset($_GET["success"])): ?>
            <div class="alert alert-success">
                <a class="close" data-dismiss="alert" href="#">&times;</a>
                The puzzle was successfully saved.
            </div>
        <?php endif ?>

        <?php if (isset($puzzle_name_error)): ?>
            <div class="alert alert-error">
                <a class="close" data-dismiss="alert" href="#">&times;</a>
                Puzzle name is required
            </div>
        <?php endif ?>

        <fieldset id="main">
            <legend>Words</legend>

        <div class="col-lg-6">
            <label for="puzzle-name">hola</label>
        <div class="input-group">
            <input type="text" id="puzzle-name" class="form-control" name="puzzle-name" value="<?php echo isset($name) ? $name : ''; ?>"/>
            <span class="input-group-btn">
                <input type="submit" class="btn btn-success" value="Save">
            </span>
        </div>
        <br>
            <label class="" for="clues">Words and clues <small style="color:  #737373; font-weight: normal">(Use a <code>:</code> to separate words from clues.)</small></label>
                <textarea rows="20" class="form-control" id="clues" name="clues" placeholder="WORD: CLUE"/><?php
                if (isset($data['clues']) && !empty($data['clues']))
                    echo $data['clues'];
                ?></textarea>
        </div>

        <div class="col-lg-6 text-center">
            <h1>Preview</h1>
            <br>
            <crossword></crossword>
        </div>
        </fieldset>
    </form>
</div>

<!--<script src="js/admin.js" type="text/javascript"></script>-->
<script src="../source/common/Modernizr.min.js"></script>
        <script>
        BASE = "../";
        Modernizr.addTest("shadow_is_good", function(){
            var ctx = document.createElement("canvas").getContext("2d");
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowBlur = 4;
            ctx.shadowColor = "red";
            ctx.fillRect(100, 100, 30, 30);
            var data = ctx.getImageData(107, 96, 1, 1).data;
            return data[3] === 0;
        });
        
        Modernizr.load({
            load: [
                BASE+'source/common/Utils.js',
                BASE+'source/common/MKEvents.min.js',
                BASE+'source/common/EventEmitter.js',
                BASE+'source/common/reqwest.min.js',
                BASE+'source/common/PointerTracker.min.js',
                BASE+'source/Board.js',
                BASE+'source/Ui.js',
                BASE+'source/Crossword.js'
            ],

            complete: function(e) {
                var crosswords = document.getElementsByTagName("crossword");
                for (var i = 0; i < crosswords.length; i++) {
                var crossword = crosswords[i]
                    cross = new game.Crossword({
                            size: 17,
                            container: crossword
                        });
                    $textarea.keydown();
                }
            }
        })

        var $textarea = $("textarea"),timeout;
        $textarea.on("keydown", function(){
            clearTimeout(timeout); var value = this.value;
            timeout = setTimeout(function() {
                cross.createBoard(game.$.parseData(value).list);
            }, 300)
        });

        $("update-preview").on("click", function(){
            $textarea.change();
        })
        </script>