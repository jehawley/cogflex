var formSet = false;

$(document).ready(function () {
  setInterval(autoSaveAndUpdate, 1000);
});

function autoSaveAndUpdate() {
  generateTrials();
  var item, count = $('#trialCount').val();
  var i;
  for (i = 2; i <= count; ++i) {
    item = sessionStorage.getItem('section' + i + 'R');
    if (item === 'true') {
      $('#section' + i + 'R').attr('checked', item);
    }
  }
  for (i = 1; i <= count; ++i) {
    
  }
}

function clearForm() {
}

function generateTrials() {
  var count = $('#trialCount').val();
  var i, entry;
  $('#trialContainer').empty();
  $('#trialContainer').append('<ol id="trialList"> </ol>');
  for (i = 1; i <= count; ++i) {
    entry = '<li id="section' + i + '"> \n';
    entry += '<div class="sectionContainer"> \n';
    entry += '<label for="section' + i +
             'Trials"> Success Probability </label>\n';
    entry += '<input id="section' + i + 'Trials" class="probField" ' +
             'name="section' + i + 'Trials" type="number"' +
             ' min="0.5" max="1.0"> \n';
    entry += '<label for="section' + i + 'Count">' + 
             ' Number of Trials </label>';
    entry += '<input id="section' + i + 'Count" class="countField" ' +
             ' type="number" min="1" step="1">';
    entry += '<label for="section' + i +
             'R"> Reversal? </label>';
    if (i === 1) {
      entry += '<input id="section' + i + 'R" class="rBox" ' +
               'name="section' + i + 'R" type="checkbox" ' +
               'value=1 disabled>';
    } else {
      entry += '<input id="section' + i + 'R" class="rBox" ' +
               'name="section' + i + 'R" type="checkbox" ' +
               'value=1 >';
    }
    entry += '</div> \n </li>'
    $('#trialList').append(entry);
    if (i > 1) {
      // TODO: Deal with closure issue
      $('#section' + i + 'R').click((function (i) {
                                                    return function () {
                                                      saveBox(i)
                                                    }; })(i));
    }
  }  
}

function saveBox(id) {
  var ref = 'section' + id + 'R';
  if ($('#' + ref).attr('checked')) {
    sessionStorage.setItem(ref, 'true');
  } else {
    sessionStorage.setItem(ref, 'false');
  }
}
