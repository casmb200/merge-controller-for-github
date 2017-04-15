$(function(){

  init();

  function init() {

    chrome.storage.local.get(function(items) {
      if (Object.keys(items).length === 0) {
        // Set Default
        var items = {}
        items['github_url'] = 'https://github.com';
        chrome.storage.local.set(items, function(e) {
          init();
        });
      }
      $('#f_github_url').val(items.github_url);
      $('#f_title_rule').val(items.title_rule);
      $('#f_base_user').val(items.base_user);
      $('#f_base_repository').val(items.base_repository);
      $('#f_base_branch').val(items.base_branch);
      $('#f_head_user').val(items.head_user);
      $('#f_head_repository').val(items.head_repository);
      $('#f_head_branch').val(items.head_branch);
    });
  }

  // Save
  $('#b_save').on('click', function(e) {
    var items = {}
    items['github_url'] = $('#f_github_url').val();
    items['title_rule'] = $('#f_title_rule').val();
    items['base_user'] = $('#f_base_user').val();
    items['base_repository'] = $('#f_base_repository').val();
    items['base_branch'] = $('#f_base_branch').val();
    items['head_user'] = $('#f_head_user').val();
    items['head_repository'] = $('#f_head_repository').val();
    items['head_branch'] = $('#f_head_branch').val();
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
