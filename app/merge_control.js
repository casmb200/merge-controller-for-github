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
          if (is_target_request() && is_target_title()) {
            $('.btn-group-merge>.js-details-target').attr('disabled', 'disabled');
            $('.btn-group-merge>.js-details-target').html('Do not merge!');
            $('.btn-group-merge>.js-menu-target').attr('disabled', 'disabled');
          }
        });
      }
    }

    // target user, repository, and branch
    function is_target_request() {
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
        if (check(items.base_user, base.user) && check(items.base_repository, base.repository) && check(items.base_branch, base.branch)
            && check(items.head_user, head.user) && check(items.head_repository, head.repository) && check(items.head_branch, head.branch)) {
          return true;
        }
      }
      return false;
    }

    function check(storage, str) {
      return (storage == '*' || storage == str);
    }

    // target title
    function is_target_title() {
      var title = $('span.js-issue-title').html() || '';
      var title_rules = [];
      if (items.title_rule.search('|') == -1) {
        title_rules.push(items.title_rules);
      } else {
        title_rules = items.title_rule.split('|');
      }
      for (var str of title_rules) {
        if (title.search(str) != -1) {
          return true;
        }
      }
      return false;
    }

  });

});
