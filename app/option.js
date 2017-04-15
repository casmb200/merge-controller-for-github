$(function(){

  init();

  function init() {

    chrome.storage.local.get(function(items) {
      if (Object.keys(items).length === 0) {
        // Set Default
        var items = {}
        items['url'] = 'https://github.com';
        chrome.storage.local.set(items, function(e) {
          init();
        });
      }
      $('#f_github_url').val(items.url);
      $('#f_title_rule').val(items.title_rule);
      $('#f_user').val(items.user);
      $('#f_repository').val(items.repository);
      $('#f_branch').val(items.branch);
    });
  }

  // Save
  $('#b_save').on('click', function(e) {
    var items = {}
    items['url'] = $('#f_github_url').val();
    items['title_rule'] = $('#f_title_rule').val();
    items['user'] = $('#f_user').val();
    items['repository'] = $('#f_repository').val();
    items['branch'] = $('#f_branch').val();
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
