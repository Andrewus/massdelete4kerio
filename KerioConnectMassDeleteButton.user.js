// ==UserScript==
// @name KerioConnectMassDeleteButton
// @description Массовое удаление сообщений в Kerio Connect
// @author Andrewus
// @license MIT
// @version 1.0
// @include */webmail/index2.html#mail
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant none
// ==/UserScript==
var Global = new Object();
// Количество сообщений на странице
Global.messagesOnPage = 50;
// Миллисекунд между удалениями
Global.deleteDelay = 50;
Global.messagesPreviousCount = 0;
Global.messagesCount = 0;
Global.LoopFunc = function() {
    Global.messagesCount = $('#maillist-1126-body tr td span.clickable').length;
    
    if ( // Эмулируем повторное нажатие на кнопку при достижении 50 сообщений на странице
        Global.messagesCount >= Global.messagesOnPage
        // Или если вдруг подгрузка новых прекратилась
        || Global.messagesCount == Global.messagesPreviousCount
    ) {
        $("#massDeleteButton").trigger('click');
        Global.messagesPreviousCount = 0;
    }
    Global.messagesPreviousCount = Global.messagesCount;
    setTimeout(Global.LoopFunc, 1000);
};


// Добавляем кнопку
window.addEventListener('load', function(){var checker=setInterval(function(){
	if(typeof ($ = jQuery.noConflict()) != "undefined") {
		clearInterval(checker);
      // Не надо ставить две кнопки
      if (
          typeof($("#massDeleteButton").attr("title")) != 'undefined'
          && typeof($("#webmailbutton-1136-btn").attr("title")) != 'undefined'
      ) {
          return true;
      } else {
          $("#webmailbutton-1136-btn").parent().wrap('<div role="presentation" style="width: 45px; height: 32px; margin: 0px; left: 345px; top: 7px;" class="x-component webmailButton withIcon x-box-item x-component-default" id="webmailbutton-1136"><button id="massDeleteButton" tabindex="0" title="Массовое удаление" style="height:32px;" type="button" class="webmailButton-btn over">MD</button></div>');
      }
	}
},100);}, false);

window.addEventListener('click', function(e){
    // Ловим клик по нужной кнопке
    if($(e.target).attr("id") == 'massDeleteButton') {
       var time = 100;
       
       $('#maillist-1126-body tr td span.clickable').each(function(i){
           setTimeout(function(item = i) {
               // Нажатие на сообщение
               $('#maillist-1126-body tr td span.clickable:eq(' + item + ')').trigger("click");
               // Кнопка "удалить""
               $("#webmailbutton-1136-btn").click();
           }, time);
           time = time + Global.deleteDelay;
           if (i >= Global.messagesOnPage-1) {
               Global.LoopFunc();
           }
       });
    } else {
       // Ненужная кнопка
    }
}, false);
