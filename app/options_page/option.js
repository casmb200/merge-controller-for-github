$(function(){

  // Set Message
  $('.msg').each(function(e) {
    let column = $(this).data('message');
    $(this).html(chrome.i18n.getMessage(column));
  });

  // Prohibit enter submit
  $(document).on("keypress", "input:not(.allow_submit)", function(event) {
    return event.which !== 13;
  });

  // Toggle example
  $('#example-data').hide();
  $('#example-title').on('click', function(e) {
    $('#example-data').toggle();
  });

  // Get local storage
  chrome.storage.local.get(function(storage) {

    // Not local storage
    if (Object.keys(storage).length === 0) {
      // Set Default
      storage = {
        'github_url': 'https://github.com',
        'message': 'Not allowed to merge!',
        'settings': [{
          'merge': 'allow'
        }]
      };
      chrome.storage.local.set(storage, function(e) {});
    }
    $('#f_github_url').val(storage.github_url);
    $('#f_message').val(storage.message);
    for (let setting of storage.settings) {
      const add_number = add_row();
      // text
      $.each($(`#opt-table>ul.row_${add_number}`).find('input[type=text]'), function(index, value) {
        let match = $(this).attr('name').match(/^f\_(.+)\_\d+$/);
        if (match !== null && match.length >= 2 ) {
          $(this).val(setting[match[1]]);
        }
      });
      // radio
      $(`#f_merge_${add_number}_${setting.merge}`).prop('checked', true);
    }

    // Add Row
    $(document).on('click', '.b_add', function(e) {
      const select_number = $('.b_add').index(this) + 1;
      add_row(select_number);
    });

    // Delete Row
    $(document).on('click', '.b_remove', function(e) {
      const select_number = $('.b_remove').index(this) + 1;
      remove_row(select_number);
    });

    // Move to Up
    $(document).on('click', '.b_up', function(e) {
      const select_number = $('.b_up').index(this) + 1;
      if (select_number <= 1) { return; }
      change_val(select_number, select_number - 1, 'replace');
    });

    // Move to Down
    $(document).on('click', '.b_down', function(e) {
      const select_number = $('.b_down').index(this) + 1
      const max_number = $('#opt-table>ul').length - 1;
      if (select_number >= max_number) { return; }
      change_val(select_number, select_number + 1, 'replace');
    });

    // Save
    $('#b_save').on('click', function(e) {

      if ($('#inputForm')[0].checkValidity() == false) {
        $('#b_check').click();
        return false;
      }

      const max_number = $('#opt-table>ul').length - 1;
      let storage = {
        'github_url': $('#f_github_url').val(),
        'message': $('#f_message').val(),
        'settings': []
      };
      for (let i=1; i<=max_number; i++) {
        let setting = {};
        // text
        $.each($(`#opt-table>ul.row_${i}`).find('input[type=text]'), function(index, value) {
          let match = $(this).attr('name').match(/^f\_(.+)\_\d+$/);
          if (match !== null && match.length >= 2 ) {
            setting[match[1]] = $(this).val();
          }
        });
        // radio
        setting['merge'] = $(`input[name=f_merge_${i}]:checked`).val();
        storage.settings.push(setting);
      }
      chrome.storage.local.set(storage, function(e) {
        alert(chrome.i18n.getMessage('saveCompleted'));
      });
    });

    // Reset
    $('#b_reset').on('click', function(e) {
      if (window.confirm(chrome.i18n.getMessage('confirm'))) {
        chrome.storage.local.clear();
        location.reload();
      }
    });

    function add_row(select_number) {
      const add_number = $('#opt-table>ul').length;
      const html = `<ul class="opt-body clearfix row_${add_number}">`
                 +   `<li><input type="text" id="f_title_rule_${add_number}" name="f_title_rule_${add_number}" value="" placeholder="e.g.) WIP|wip" required /></li>`
                 +   `<li><input type="text" id="f_base_user_${add_number}" name="f_base_user_${add_number}" value="" placeholder="e.g.) github" required /></li>`
                 +   `<li><input type="text" id="f_base_repository_${add_number}" name="f_base_repository_${add_number}" value="" placeholder="e.g.) repo" required /></li>`
                 +   `<li><input type="text" id="f_base_branch_${add_number}" name="f_base_branch_${add_number}" value="" placeholder="e.g.) master" required /></li>`
                 +   `<li><input type="text" id="f_head_user_${add_number}" name="f_head_user_${add_number}" value="" placeholder="e.g.) hogehoge" required /></li>`
                 +   `<li><input type="text" id="f_head_repository_${add_number}" name="f_head_repository_${add_number}" value="" placeholder="e.g.) repo" required /></li>`
                 +   `<li><input type="text" id="f_head_branch_${add_number}" name="f_head_branch_${add_number}" value="" placeholder="e.g.) feature" required /></li>`
                 +   `<li>`
                 +     `<label><input type="radio" id="f_merge_${add_number}_allow" name="f_merge_${add_number}" value="allow" checked />Allow</label>`
                 +     `<label><input type="radio" id="f_merge_${add_number}_disallow" name="f_merge_${add_number}" value="disallow" />Disallow</label>`
                 +   `</li>`
                 +   `<li>`
                 +     `<button type="button" class="b_add char">+</button>`
                 +     `<button type="button" class="b_remove char">-</button>`
                 +     `<button type="button" class="b_up char">↑</button>`
                 +     `<button type="button" class="b_down char">↓</button>`
                 +   `</li>`
                 + `</ul>`;
      $('#opt-table').append(html);
      // Shift
      if (select_number) {
        for (let i=(add_number-1); i>select_number; i--) {
          change_val(i, i+1, 'move');
        }
      }
      return add_number;
    }

    function remove_row(select_number) {
      const max_number = $('#opt-table>ul').length - 1;
      if (max_number == 1) {
        alert(chrome.i18n.getMessage('notDelete'));
        return;
      }
      // Shift
      for (let i=select_number; i<=max_number; i++) {
        change_val(i+1, i, 'move');
      }
      // Remove Last Row
      $('ul.opt-body.row_' + max_number).remove();
    }

    function change_val(from_number, to_number, change_type) {

      let tmp;
      // text
      $.each($(`#opt-table>ul.row_${from_number}`).find('input[type=text]'), function(index, value) {
        let match = $(this).attr('name').match(/^f\_(.+)\_\d+$/);
        if (match !== null && match.length >= 2 ) {
          if (change_type == 'replace') {
            tmp = $(`#f_${match[1]}_${to_number}`).val();
          } else {
            tmp = '';
          }
          $(`#f_${match[1]}_${to_number}`).val( $(`#f_${match[1]}_${from_number}`).val() );
          $(`#f_${match[1]}_${from_number}`).val(tmp);
        }
      });

      // radio
      if (change_type == 'replace') {
        tmp = $(`input[name=f_merge_${to_number}]:checked`).val();
      } else {
        tmp = 'allow';
      }
      $(`input[name=f_merge_${to_number}][value=${ $(`input[name=f_merge_${from_number}]:checked`).val() }`).prop('checked', true);
      $(`#f_merge_${from_number}_${tmp}`).prop('checked', true);
    }

  });
});
