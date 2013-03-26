var commits = document.getElementsByClassName('commit-links');

var foreach = Array.prototype.forEach;
foreach.call(commits, function(commit) {
	addCheckbox(commit);
});

function addCheckbox(commitLinkNode) {
    var ref = commitLinkNode.children[0].attributes['data-clipboard-text'].value;

    var container = document.createElement('span');
    container.className = 'commit-selector';
    container.style.float = 'left';
    container.style.marginTop = '5px';

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
	    window.location = compareUrl(document.URL, firstCommit, secondCommit);
	}
    }
}

function compareUrl(baseUrl, firstCommit, secondCommit) {
    var base = baseUrl.substr(0, baseUrl.lastIndexOf('/'));
    base = base.substr(0, base.lastIndexOf('/'));
    return base + "/compare/" + secondCommit + "..." + firstCommit;
}