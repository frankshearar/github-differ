var onPullRequestCommitPage = document.URL.indexOf("/pull/") != -1;
var onComparePage = document.URL.indexOf("/compare/") != -1;

var commits = document.getElementsByClassName('commit-links');
var pullCommits = document.getElementsByClassName('commit');

var foreach = Array.prototype.forEach;
foreach.call(commits, function(commit) {
	addCheckbox(commit, commit.children[0].attributes['data-clipboard-text'].value, true);
});
foreach.call(pullCommits, function(node) {
	var messageNode = node.children[2];
	var codeNode = messageNode.children[1];
	var commitRef = '';
	if (onComparePage) {
		var metaNode = node.children[3];
		var tokens = metaNode.children[0].children[0].attributes['href'].value.split("/");
		commitRef = tokens[tokens.length - 1];
	} else {
		commitRef = node.attributes['data-channel'].value.split(":")[2];
	}
	addCheckbox(messageNode, commitRef, false);
});

function addCheckbox(commitLinkNode, ref, floatLeft) {
    var container = document.createElement('span');
    container.className = 'commit-selector';
    container.style.marginTop = '5px';
    if (floatLeft) {
	container.style.float = 'left';
    } else {
	container.style.float = 'right';
    }

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'box-' + ref;
    input.value = ref;
    input.onclick = compareDiffs;

    container.appendChild(input);
    commitLinkNode.insertBefore(container, commitLinkNode.lastChild);
}

function compareDiffs(event) {
    if (event.currentTarget.checked) {
	var filter = Array.prototype.filter;
	var selectedDiffs = filter.call(document.getElementsByClassName('commit-selector'),
					function(node) {
					    return node.children[0].checked
					});
	if (selectedDiffs.length == 2) {
	    var firstCommit = selectedDiffs[0].children[0].value;
	    var secondCommit = selectedDiffs[1].children[0].value;
	    if (onPullRequestCommitPage || onComparePage) {
		// commits in a Pull Request's Commits tab have time travelling DOWN
		window.location = compareUrl(document.URL, secondCommit, firstCommit);
	    } else {
		// commits in a Pull Request's Commits tab have time travelling UP
		window.location = compareUrl(document.URL, firstCommit, secondCommit);
	    }
	}
    }
}

function compareUrl(baseUrl, firstCommit, secondCommit) {
    var base = baseUrl.substring("https://".length, baseUrl.length);
    var tokens = base.split("/");
    var url = "https://" + tokens[0] + "/" + tokens[1] + "/" + tokens[2] + "/compare/" + secondCommit + "..." + firstCommit;
    return url;
}
