$(function(){

  init();

  function init() {

    chrome.storage.local.get(function(items) {
      if (Object.keys(items).length === 0) {
        // Set Default
        var items = {}
        items.github_url = 'https://github.com';
        items.settings = [];
        items.settings.push({
          'merge': 'allow'
        });
        remove_row(1);
        chrome.storage.local.set(items, function(e) {});
      }
      $('#f_github_url').val(items.github_url);
      for (var setting of items.settings) {
        var add_number = add_row();
        $('input[name=f_title_rule_' + add_number + ']').val(setting.title_rule);
        $('input[name=f_base_user_' + add_number + ']').val(setting.base_user);
        $('input[name=f_base_repository_' + add_number + ']').val(setting.base_repository);
        $('input[name=f_base_branch_' + add_number + ']').val(setting.base_branch);
        $('input[name=f_head_user_' + add_number + ']').val(setting.head_user);
        $('input[name=f_head_repository_' + add_number + ']').val(setting.head_repository);
        $('input[name=f_head_branch_' + add_number + ']').val(setting.head_branch);
        $('input[name=f_merge_' + add_number + '][value='+setting.merge+']').prop('checked', true);
      }
    });
  }

  function add_row() {
    var add_number = $('#opt-table>ul').length;
    var html = '<ul class="opt-body clearfix row_' + add_number + '">'
             +   '<li><input type="text" name="f_title_rule_' + add_number + '" value="" placeholder="ex) WIP|wip" /></li>'
             +   '<li><input type="text" name="f_base_user_' + add_number + '" value="" placeholder="ex) github" /></li>'
             +   '<li><input type="text" name="f_base_repository_' + add_number + '" value="" placeholder="ex) repo" /></li>'
             +   '<li><input type="text" name="f_base_branch_' + add_number + '" value="" placeholder="ex) master" /></li>'
             +   '<li><input type="text" name="f_head_user_' + add_number + '" value="" placeholder="ex) hogehoge" /></li>'
             +   '<li><input type="text" name="f_head_repository_' + add_number + '" value="" placeholder="ex) repo" /></li>'
             +   '<li><input type="text" name="f_head_branch_' + add_number + '" value="" placeholder="ex) feature" /></li>'
             +   '<li>'
             +     '<label><input type="radio" name="f_merge_' + add_number + '" value="allow" checked />Allow</label>'
             +     '<label><input type="radio" name="f_merge_' + add_number + '" value="disallow" />Disallow</label>'
             +   '</li>'
             +   '<li>'
             +     '<button class="b_add" name="b_add_' + add_number + '">+</button>'
             +     '<button class="b_remove" name="b_del_' + add_number + '">-</button>'
             +     '<button class="b_up" name="b_up_' + add_number + '">↑</button>'
             +     '<button class="b_down" name="b_up_' + add_number + '">↓</button>'
             +   '</li>'
             + '</ul>'
    $('#opt-table').append(html);
    return add_number;
  }

  function remove_row(select_number) {
    var max_number = $('#opt-table>ul').length - 1;
    if (max_number == 1) {
      alert('You can not remove');
      return;
    }
    // Shift
    for (var i=select_number+1; i<=max_number; i++) {
      change_val(i+1, i, 'move');
    }
    // Remove Last Row
    $('ul.opt-body.row_' + max_number).remove();
  }

  function change_val(from_number, to_number, change_type) {

    var tmp_title_rule, tmp_base_user, tmp_base_repository, tmp_base_branch, tmp_head_user, tmp_head_repository, tmp_head_branch, tmp_merge;
    if (change_type == 'replace') {
      tmp_title_rule = $('input[name=f_title_rule_' + to_number + ']').val();
      tmp_base_user = $('input[name=f_base_user_' + to_number + ']').val();
      tmp_base_repository = $('input[name=f_base_repository_' + to_number + ']').val();
      tmp_base_branch = $('input[name=f_base_branch_' + to_number + ']').val();
      tmp_head_user = $('input[name=f_head_user_' + to_number + ']').val();
      tmp_head_repository = $('input[name=f_head_repository_' + to_number + ']').val();
      tmp_head_branch = $('input[name=f_head_branch_' + to_number + ']').val();
      tmp_merge = $('input[name=f_merge_' + to_number + ']:checked').val();
    } else {
      tmp_title_rule = '';
      tmp_base_user = '';
      tmp_base_repository = '';
      tmp_base_branch = '';
      tmp_head_user = '';
      tmp_head_repository = '';
      tmp_head_branch = '';
      tmp_merge = 'allowed';
    }

    $('input[name=f_title_rule_' + to_number + ']').val($('input[name=f_title_rule_' + from_number + ']').val());
    $('input[name=f_title_rule_' + from_number + ']').val(tmp_title_rule);
    $('input[name=f_base_user_' + to_number + ']').val($('input[name=f_base_user_' + from_number + ']').val());
    $('input[name=f_base_user_' + from_number + ']').val(tmp_base_user);
    $('input[name=f_base_repository_' + to_number + ']').val($('input[name=f_base_repository_' + from_number + ']').val());
    $('input[name=f_base_repository_' + from_number + ']').val(tmp_base_repository);
    $('input[name=f_base_branch_' + to_number + ']').val($('input[name=f_base_branch_' + from_number + ']').val());
    $('input[name=f_base_branch_' + from_number + ']').val(tmp_base_branch);
    $('input[name=f_head_user_' + to_number + ']').val($('input[name=f_head_user_' + from_number + ']').val());
    $('input[name=f_head_user_' + from_number + ']').val(tmp_head_user);
    $('input[name=f_head_repository_' + to_number + ']').val($('input[name=f_head_repository_' + from_number + ']').val());
    $('input[name=f_head_repository_' + from_number + ']').val(tmp_head_repository);
    $('input[name=f_head_branch_' + to_number + ']').val($('input[name=f_head_branch_' + from_number + ']').val());
    $('input[name=f_head_branch_' + from_number + ']').val(tmp_head_branch);
    $('input[name=f_merge_' + to_number + '][value=' + $('input[name=f_merge_' + from_number + ']:checked').val() + ']').prop('checked', true);
    $('input[name=f_merge_' + from_number + '][value=' + tmp_merge + ']').prop('checked', true);
  }

  // Add Row
  $(document).on('click', '.b_add', function(e) {
    add_row();
  });

  // Delete Row
  $(document).on('click', '.b_remove', function(e) {
    var select_number = $('.b_remove').index(this) + 1
    remove_row(select_number);
  });

  // Move to Up
  $(document).on('click', '.b_up', function(e) {
    var select_number = $('.b_up').index(this) + 1
    if (select_number <= 1) {
      return;
    }
    change_val(select_number, select_number - 1, 'replace');
  });

  // Move to Down
  $(document).on('click', '.b_down', function(e) {
    var select_number = $('.b_down').index(this) + 1
    var max_number = $('#opt-table>ul').length - 1;
    if (select_number >= max_number) {
      return;
    }
    change_val(select_number, select_number + 1, 'replace');
  });

  // Save
  $('#b_save').on('click', function(e) {
    var items = {}
    items.github_url = $('#f_github_url').val();
    items.settings = [];
    var max_number = $('#opt-table>ul').length - 1;
    for (var i=1; i<=max_number; i++) {
      items.settings.push({
        'title_rule':      $('input[name=f_title_rule_' + i + ']').val(),
        'base_user':       $('input[name=f_base_user_' + i + ']').val(),
        'base_repository': $('input[name=f_base_repository_' + i + ']').val(),
        'base_branch':     $('input[name=f_base_branch_' + i + ']').val(),
        'head_user':       $('input[name=f_head_user_' + i + ']').val(),
        'head_repository': $('input[name=f_head_repository_' + i + ']').val(),
        'head_branch':     $('input[name=f_head_branch_' + i + ']').val(),
        'merge':           $('input[name=f_merge_' + i + ']:checked').val()
      });
    }
    chrome.storage.local.set(items, function(e) {
      alert('Storage has been completed');
    });
  });

  // Reset
  $('#b_reset').on('click', function(e) {
    if (window.confirm('Are you sure?')) {
      chrome.storage.local.clear();
      init();
    }
  });
});
