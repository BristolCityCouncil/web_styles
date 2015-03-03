/*****************************************************************\
  Fileupload module - JQuery Plugin
/*****************************************************************\
 * This module converts Non-js fileupload components into an
 * interactive upload form. With fall backs for IE8 and Android.
 *
\*****************************************************************/

YUI().use(['module'], function(Y){
    var FileUpload = Y.uk.gov.bristol.module.extend({
        DOM: {

            'fileList'          : '.docupload__body',
            'allfiles'          : '.docupload__file',
            'files'             : '.docupload__file:not(.docupload__file--uploaded)',
            'uploadedFiles'     : '.docupload__file--success',
            'uploadbtn'         : '.form__actions',
            'removeFile'        : '.docupload__file--success .docupload__fileremove',
            'dismissFile'       : '.docupload__file--error .docupload__fileremove',
            'fileLimit'         : '.docupload__error',
            'type'              : '[name="uploadType"]',
            'fileLimitMessage'  : '[name="tooManyFilesError"]',
            'genericError'      : '[name="generalError"]',
            'tiptype'           : '.docupload__tiptype',
        },
        pluginName: 'fileUpload', /* Exports as JQuery Plugin */
        events: {
            'click $removeFile' : 'removeFile',
            'click $dismissFile' : 'dismissFile',
        },
        fileLimit : 0,
        currentLimit : 0,
        uploadLimit: 0,
        
        render: function(){

            // Legacy support for IE8/9
            if (!window.ProgressEvent || !window.FormData)
                return this.legacySupport();

            // If the preview page, also abort
            if(this.$el.hasClass('docupload--preview')) 
                return this.previewPage();

            // Set limits
            this.fileLimit = this.DOM.allfiles.length;
            this.uploadLimit = this.currentLimit = this.DOM.uploadedFiles.length;

            // Set some templates
            this.fileTemplate =  $('<div class="docupload__file"><input type="file"></div>');

            // Modify the DOM
            this.DOM.uploadbtn.remove();
            this.DOM.files.remove();
            this.DOM.fileLimit.remove();

            // GA stuff
            this.currentService = $('[data-service]').attr('data-service');

            this.tooManyFiles = $('<div/>', {
                'class' : "docupload__error docupload__error--toomuch"
            });

            // Nice code here... haha
            this.$el.find('.docupload__body').after(this.tooManyFiles);

            // Create first new file
            this.newFile();

            // chain me.
            return this;
        },
        dismissFile: function(e){
            var $el = $(e.currentTarget).closest('.docupload__file');
            $el.animate({
                height: 0,
                padding: 0,
                opacity: 0,
                width: '80%',
            }, function(){
                $(this).remove();
            });
            e.preventDefault();
        },
        removeFile: function(e){
            // Cache element
            var $el = $(e.currentTarget).closest('.docupload__file');

            // Prevent double removal
            if($el.attr('removing')) return;
            $el.removeAttr('removing');
            
            if($el.parent().nextThrough(':tabbable')) $el.nextThrough('button:tabbable').focus();
            if($el.nextThrough('button')) $el.nextThrough('button:tabbable').focus();

            $el.animate({
                height: 0,
                padding: 0,
                opacity: 0,
                width: '80%',
            }, function(){
                $(this).remove();
            });


            // If there is a delete endpoint on the remove button
            if($(e.currentTarget).attr('data-delete-endpoint')){
                // send a post to it to remove the file
                $.post($(e.currentTarget).attr('data-delete-endpoint'));
            }

            if(this.uploadLimit == this.fileLimit){
                this.currentLimit--;
                this.uploadLimit--;

                this.newFile();
                e.preventDefault();
                return;
            }
            //this.newFile();
            this.uploadLimit--;
            this.currentLimit--;

            e.preventDefault();
        },
        legacySupport: function(){
            // HAD TO REMOVE BECAUSE OF BROWSER ISSUES.
            return;
            // Changes here for older browsers.
            var $button = $('<button class="cta docupload__uploadbutton">Choose File</button><span class="filename">No file selected</span>'),
                self = this;

            // Loop through files
            this.DOM.files.each(function(){

                // Set some stuff
                var input = $(this).find('input'),
                    btn = $button.clone();

                // Hide the input button
                input.hide();

                // When bind the button to the hidden output
                btn.on('click', function(e){
                    e.preventDefault();
                    input.show().click().hide();
                });

                // Show filename when the input changes
                input.on('change', function(){
                    $(this).closest('.docupload__file').find('.filename').html(self.parseFileName($(this).val()));
                });

                // Add to file element
                $(this).append(btn);

            });
        },
        previewPage: function(){
            // Changes here for preview page
        },
        showFilesLimit: function(){
            this.DOM.tiptype.hide();
            this.tooManyFiles.html(this.DOM.fileLimitMessage.text()).fadeIn();
        },
        hideFilesLimit: function(){
            this.DOM.tiptype.show();
            this.tooManyFiles.fadeOut();
        },
        parseFileName: function($val){
            var valArray = $val.split('\\');
            valArray = valArray[valArray.length-1];
            return this.truncate(valArray, 80);
        },
        truncate: function (fullStr, strLen, separator) {
            if (fullStr.length <= strLen) return fullStr;

            separator = separator || '...';

            var sepLen = separator.length,
                charsToShow = strLen - sepLen,
                frontChars = Math.ceil(charsToShow/2),
                backChars = Math.floor(charsToShow/2);

            return fullStr.substr(0, frontChars) + 
                   separator + 
                   fullStr.substr(fullStr.length - backChars);
        },
        newFile: function(){

            // set some counters
            var i = this.currentLimit,
                self = this;

            // if we are at the limit, show the limit message
            if(i >= this.fileLimit) 
                return this.showFilesLimit();

            // If not, hide the file limit
            this.hideFilesLimit();

           
            // File template clone
            var template = this.fileTemplate.clone(true),

                // Real fileupload html element
                input = template.find('input'),

                // Fake fileupload button
                $button = $('<button class="cta docupload__uploadbutton">Choose File</button><span class="filename">No file selected</span>'),

                // Success message
                $actions = $('<div class="docupload__actions"><div class="docupload__filestatus">Uploaded <span class="icon icon--bcc icon--bcc--tick"></span> </div><div class="docupload__fileremove"><a href="#">Remove</a></div></div>');
                
                // Error message
                eractions = function(prob){ return $('<div class="docupload__actions"><div class="docupload__filestatus">'+prob+'</div><div class="docupload__fileremove"><a href="#">Dismiss</a></div></div>'); };
            

            // Create a fake input for the event ID.
            input.attr({
                // Name and id matches what liferay sends
                name: 'file',
                id: 'file',
                type: 'file',
            });

            // Hide the input now
            input.hide();

            // Bind a remove event.
            input.on('change', function(){

                // Do some setup
                var newVal = self.parseFileName($(this).val()),
                    $form = $('<form/>', {
                        'action' : '/delegate/files/upload',
                        'method' : self.DOM.fileList.closest('form').attr('method'),
                        'enctype' : self.DOM.fileList.closest('form').attr('enctype'),
                    }),
                    genericError = self.DOM.genericError.html();

                $form.append($("<input/>", {
                    type: "hidden",
                    name: "uploadType",
                    value: self.DOM.type.html(),
                }));

                // Increase the amount of files that have been UPLOADED
                self.uploadLimit++;

                // Add the hidden input with event id to invisible form
                template.find('input').appendTo($form);

                // Hide the upload button
                $button.hide();

                // Add the mock elements (upload progress)
                template.append('<div class="docupload__mock"><div class="docupload__mockupload"><div class="docupload__mockupload-container"><div class="docupload__mockupload-bar"></div></div></div><div class="docupload__mockuploadlabel">'+newVal+' <span class="filesize"></span></div></div>').find('.docupload__mock').hide().fadeIn(500);
                template.find('.filesize').hide();
                // Submit the form using ajax
                $form.ajaxForm({

                    // Handle the progress. Called whenever the progress increases
                    uploadProgress: function(event, position, total, percentComplete) {
                        
                        // Grab % valud
                        var percentVal = percentComplete + '%';

                        // Assign it to the width of the progress bar
                        template.find('.docupload__mockupload-bar').width(percentVal);

                    },

                    // Handle the successful upload of the file
                    success: function() {

                        // Ensure the percentage is 100%
                        var percentVal = '100%';
                        template.find('.docupload__mockupload-bar').width(percentVal);

                    },
                    // Handle the upload regardless if it fails or not.
                    complete: function(xhr) {
                        var response;
                        if(xhr.status == "200" /*&& response.indexOf("{") != 0*/){
                            // grab the response
                            response = JSON.parse(xhr.responseText);
                        }else{
                            // Mock the response
                            response = {
                                message: genericError,
                                status: "ERROR",
                            };
                        }

                        // If success is passed
                        if( response.status =="SUCCESS" ){
                            // add the class and add the success message
                            template.addClass('docupload__file--success').append($actions.hide().fadeIn(300));
                            template.find('.filesize').show().html(response.fileSize);
                            template.find('.docupload__fileremove').attr('data-delete-endpoint', response.deletePath);
                            
                        } else { // If success is not passed, assume error
                            
                            // Generate the error message and remove button.
                            var $eraction = eractions(response.message);
                            
                            // Add the error class
                            template.addClass('docupload__file--error').append($eraction.hide().fadeIn(300));
                            
                            // remove empty span
                            //template.find('span.filesize').remove();
                            
                            // Do some housekeeping to allow the file that was just uploaded
                            // to be retried and not count towards total files
                            self.currentLimit--;

                            // If it was the last file, create new file button
                            if(self.uploadLimit == self.fileLimit)
                                self.newFile();

                            self.uploadLimit--;

                        }
                        // Add the done class to hide it from the DOM
                        template.find('.docupload__mockupload').addClass('docupload__mockupload--done');

                    }
                    // and finally submit the form
                }).submit();

                if(self.currentService){
                    ga('send', 'event', self.currentService, 'file-upload');
                }
                // add this class.
                template.addClass('docupload__file--mockuploading');

                // Create new file, if not Focus the input
                if(!self.newFile()){
                    //self.DOM.fileList.next().nextThrough(':tabbable').focus();
                }
            
            });
            
            // When the upload button is clicked:
            $button.on('click', function(e){
                e.preventDefault();
                // show the input, click it and hide it again
                // This is secrutiy concerns of the browser.
                // You can only mock a click event if it is
                // visible. Works on all browsers.
                input.show().click().hide();
            });
            
            // Fix for android keyboard bug
            $button.on('mousedown', function(e){
                $(this).focus();
            });

            // Add the button
            template.append($button);

            // Increase currently uploaded files limit
            this.currentLimit++;

            // Append it to the file list
            this.DOM.fileList.append(template);

            //template.nextThrough(':tabbable').focus();

            return template;
        }
    });
});