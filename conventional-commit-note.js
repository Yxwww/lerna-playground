// This function is .toString() opt.transform in conventional-changelog-writer
const transform = (commit, context) => {
	let discard = true;
	const issues = [];

	// console.log('note', note)
	commit.notes.forEach(note => {
		note.title = 'BREAKING CHANGES';
		discard = false;
	});

	if (commit.type === 'feat') {
		commit.type = 'Features';
	} else if (commit.type === 'fix') {
		commit.type = 'Bug Fixes';
	} else if (commit.type === 'perf') {
		commit.type = 'Performance Improvements';
	} else if (commit.type === 'revert' || commit.revert) {
		commit.type = 'Reverts';
	} else if (discard) {
		console.log('discarded')
		return;
	} else if (commit.type === 'docs') {
		commit.type = 'Documentation';
	} else if (commit.type === 'style') {
		commit.type = 'Styles';
	} else if (commit.type === 'refactor') {
		commit.type = 'Code Refactoring';
	} else if (commit.type === 'test') {
		commit.type = 'Tests';
	} else if (commit.type === 'build') {
		commit.type = 'Build System';
	} else if (commit.type === 'ci') {
		commit.type = 'Continuous Integration';
	}

	if (commit.scope === '*') {
		commit.scope = '';
	}

	if (typeof commit.hash === 'string') {
		commit.shortHash = commit.hash.substring(0, 7);
	}

	if (typeof commit.subject === 'string') {
		let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;
		if (url) {
			url = `${url}/issues/`;
			// Issue URLs.
			commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
				issues.push(issue);
				return `[#${issue}](${url}${issue})`;
			});
		}
		if (context.host) {
			// User URLs.
			commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
				if (username.includes('/')) {
					return `@${username}`;
				}

				return `[@${username}](${context.host}/${username})`;
			});
		}
	}

	// remove references that already appear in the subject
	commit.references = commit.references.filter(reference => {
		if (issues.indexOf(reference.issue) === -1) {
			return true;
		}

		return false;
	});

	return commit;
};

const context = {
	commit: 'commit',
	issue: 'issues',
	date: '2024-02-28',
	version: '5.39.0',
	host: 'https://github.com',
	owner: 'MappedIn',
	repository: 'mappedin-core-sdk',
	repoUrl: 'https://github.com',
	packageData: {
		name: '@packages/internal',
		private: true,
		version: '5.39.0',
		readme: 'ERROR: No README data found!',
		_id: '@packages/internal@5.39.0',
		repository: { url: 'git+ssh://git@github.com/MappedIn/mappedin-core-sdk.git' },
		bugs: { url: 'https://github.com/MappedIn/mappedin-core-sdk/issues' },
		homepage: 'https://github.com/MappedIn/mappedin-core-sdk#readme',
	},
	gitSemverTags: [
		'@packages/internal@5.29.3',
		'@packages/internal@5.29.2',
		'@packages/internal@5.29.1',
		'@packages/internal@5.29.0',
	],
	linkReferences: true,
};

const workingCommit = {
	type: 'feat',
	scope: 'test',
	subject: 'some feature',
	merge: null,
	header: 'feat(test): some feature',
	body: null,
	footer: null,
	notes: [],
	references: [],
	mentions: [],
	revert: null,
	hash: 'hash',
	gitTags: 'git tags',
	committerDate: '2024-02-26',
};

const notWorkingCommit = {
	type: 'chore',
	scope: 'test',
	subject: 'some chore work',
	merge: null,
	header: 'chore(verychore): some chore work',
	body: null,
	footer: null,
	notes: [],
	references: [],
	mentions: [],
	revert: null,
	hash: 'some-hash',
	gitTags: '',
	committerDate: '2024-02-26',
};

// NOTE: Transform handle 'feat' correctly. Gets transformed commit back

// console.log('result', transform(workingCommit, context));

// NOTE: chore is unhandled. Tranform returns undefined. Following conventional changelog discard this commit
console.log('result', transform(notWorkingCommit, context));
