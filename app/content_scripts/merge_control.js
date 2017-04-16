$(function() {

  // Get local storage
  chrome.storage.local.get(function(storage) {

    // Event trigger
    merge_control();
    $(window).on('statechange', function(e, data) {
      if (history.state.url !== undefined) {
        merge_control();
      }
    });

    // Main Process
    function merge_control() {
      // Target URL
      if (is_match_url(storage.github_url, location.href) && location.href.search(/\/pull\//) != -1) {
        // Wait until merge button is load
        $('.btn-group-merge>.js-menu-targe').ready(function() {
          if (is_target_pull_request()) {
            // Disable button
            $('.btn-group-merge>.js-details-target').prop('disabled', true);
            $('.btn-group-merge>.js-details-target').html('Merge disallowed!');
            $('.btn-group-merge>.js-menu-target').prop('disabled', true);
          }
        });
      }
    }

    // It is judged whether it is pull request of target
    function is_target_pull_request() {

      const base_ref = $('span.base-ref').attr('title') || '';
      const head_ref = $('span.head-ref').attr('title') || '';

      if (base_ref.split(/[\/:]/).length >= 3 && head_ref.split(/[\/:]/).length >= 3) {
        const base = {
          "user": base_ref.slice(0, base_ref.indexOf("/")),
          "repository": base_ref.slice(base_ref.indexOf("/") + 1, base_ref.indexOf(":")),
          "branch": base_ref.slice(base_ref.indexOf(":") + 1)
        }
        const head = {
          "user": head_ref.slice(0, head_ref.indexOf("/")),
          "repository": head_ref.slice(head_ref.indexOf("/") + 1, head_ref.indexOf(":")),
          "branch": head_ref.slice(head_ref.indexOf(":") + 1)
        }
        for (const setting of storage.settings) {
          // Match setting
          if (is_match_pattern(setting.base_user, base.user) && is_match_pattern(setting.base_repository, base.repository) && is_match_pattern(setting.base_branch, base.branch)
            && is_match_pattern(setting.head_user, head.user) && is_match_pattern(setting.head_repository, head.repository) && is_match_pattern(setting.head_branch, head.branch)
            && is_match_title_rule(setting.title_rule)) {
              return (setting.merge == 'disallow')
          }
        }
      }
      return false;
    }

    function is_match_url(setting, url) {
      for (let word of setting.split('|')) {
        if (url.search(setting) != -1) {
          return true;
        }
      }
      return false;
    }

    function is_match_pattern(setting, str) {
      // character [*] is allow
      if (setting == '*') { return true; }

      for (let word of setting.split('|')) {
        // Found the word
        if (str == word) {
          return true;
        }
      }
      return false;
    }

    function is_match_title_rule(title_rule) {
      // character [*] is allow
      if (title_rule == '*') { return true; }

      const title = $('span.js-issue-title').html() || '';
      for (let word of title_rule.split('|')) {
        // Found the word
        if (title.search(word) != -1) {
          return true;
        }
      }
      return false;
    }
  });
});
