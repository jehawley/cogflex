var formSet = false;
var trialCount;

$(document).ready(function () {
  clearForm();
  $('#reset').click(clearForm);
  trialCount = $('#trialCount').val();
  generateTrials();
  setInterval(autoSaveAndUpdate, 1000);
});

function autoSaveAndUpdate() {
  var item, count = $('#trialCount').val();
  var i;

  if (count !== trialCount) {
    generateTrials();
  }

  for (i = 2; i <= count; ++i) {
    item = sessionStorage.getItem('section' + i + 'R');
    if (item === 'true') {
      $('#section' + i + 'R').attr('checked', item);
    }
  }
}

function generateTrials() {
  var count = $('#trialCount').val();
  var i, entry;
  var data, ref;
  for (i = 1; i <= count; ++i) {
    ref = 'section' + i + 'Trials';
    data = $('#' + ref).val();
    if (data) {
      sessionStorage.setItem(ref, data);
    }
    ref = 'section' + i + 'Count';
    data = $('#' + ref).val();
    if (data) {
      sessionStorage.setItem(ref, data);
    }
  }
  trialCount = count;
  $('#trialContainer').empty();
  $('#trialContainer').append('<ol id="trialList"> </ol>');
  for (i = 1; i <= count; ++i) {
    entry = '<li id="section' + i + '"> \n';
    entry += '<div class="sectionContainer"> \n';
    entry += '<label for="section' + i +
             'Trials"> Success Probability </label>\n';
    entry += '<input id="section' + i + 'Trials" class="probField" ' +
             'name="section' + i + 'Trials" type="number"' +
             ' min="0.5" max="1.0" step="0.001"> \n';
    entry += '<label for="section' + i + 'Count">' + 
             ' Number of Trials </label>';
    entry += '<input id="section' + i + 'Count" class="countField" ' +
             ' name="section' + i + 'Count" type="number" min="1" step="1">';
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
      $('#section' + i + 'R').click((function (i) {
                                                    return function () {
                                                      saveBox(i)
                                                    }; })(i));
    }
    data = sessionStorage.getItem('section' + i + 'Trials');
    if (data) {
      $('#section' + i + 'Trials').val(parseFloat(data));
    }
    data = sessionStorage.getItem('section' + i + 'Count');
    if (data) {
      $('#section' + i + 'Count').val(parseFloat(data));
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

function saveProbability(id) {
  var data, ref;
  ref = 'section' + id + 'Trials';
  data = $('#' + ref).val();
  if (data) {
    sessionStorage.setItem(ref, data);
  }
}

function clearForm() {
  sessionStorage.clear();
}
