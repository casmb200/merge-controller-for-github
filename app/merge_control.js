$(function() {

  chrome.storage.local.get(function(items) {

    merge_control();
    $(window).on('statechange', function(e, data) {
      if (history.state.url !== undefined) {
        merge_control();
      }
    });

    function merge_control() {

      // target Pull Request URL
      if (location.href.search(items.github_url) != -1 && location.href.search(/\/pull\//) != -1) {
        $('.btn-group-merge').ready(function() {
          if (is_target_pull_request()) {
            $('.btn-group-merge>.js-details-target').attr('disabled', 'disabled');
            $('.btn-group-merge>.js-details-target').html('Do not merge!');
            $('.btn-group-merge>.js-menu-target').attr('disabled', 'disabled');
          }
        });
      }
    }

    function is_target_pull_request() {
      var base_ref = $('span.base-ref').attr('title') || '';
      var head_ref = $('span.head-ref').attr('title') || '';
      if (base_ref.split(/[\/:]/).length >= 3 && head_ref.split(/[\/:]/).length >= 3) {
        var base = {
          "user": base_ref.slice(0, base_ref.indexOf("/")),
          "repository": base_ref.slice(base_ref.indexOf("/") + 1, base_ref.indexOf(":")),
          "branch": base_ref.slice(base_ref.indexOf(":") + 1)
        }
        var head = {
          "user": head_ref.slice(0, head_ref.indexOf("/")),
          "repository": head_ref.slice(head_ref.indexOf("/") + 1, head_ref.indexOf(":")),
          "branch": head_ref.slice(head_ref.indexOf(":") + 1)
        }
        for (var setting of items.settings) {
          if (check(setting.base_user, base.user) && check(setting.base_repository, base.repository) && check(setting.base_branch, base.branch)
            && check(setting.head_user, head.user) && check(setting.head_repository, head.repository) && check(setting.head_branch, head.branch)
            && is_match_title_rule(setting.title_rule)) {
              if (setting.merge == 'disallow') {
                return true;
              } else {
                return false;
              }
          }
        }
      }
      return false;
    }

    function check(storage, str) {
      return (storage == '*' || storage == str);
    }

    function is_match_title_rule(title_rule) {
      if (title_rule == '*') {
        return true;
      }
      var title = $('span.js-issue-title').html() || '';
      var words = [];
      if (title_rule.search('|') == -1) {
        words.push(title_rule);
      } else {
        words = title_rule.split('|');
      }
      for (var word of words) {
        if (title.search(word) != -1) {
          return true;
        }
      }
      return false;
    }

  });

});
