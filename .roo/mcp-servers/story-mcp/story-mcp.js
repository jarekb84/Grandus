const fs = require('fs');
const path = require('path');

const STATUS_PREFIX = 'STATUS: ';
const TASKS_PREFIX = 'TASKS_PENDING: ';

function exitWithError(message) {
    console.error(JSON.stringify({ error: message }));
    process.exit(1);
}

function readFileLines(filePath) {
    try {
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            exitWithError(`File not found: ${filePath}`);
        }
        const content = fs.readFileSync(absolutePath, 'utf8');
        return content.split('\n');
    } catch (err) {
        if (err.code === 'ENOENT') {
            exitWithError(`File not found: ${filePath}`);
        } else {
            exitWithError(`Error reading file ${filePath}: ${err.message}`);
        }
    }
}

function writeFileLines(filePath, lines) {
    try {
        const absolutePath = path.resolve(filePath);
        fs.writeFileSync(absolutePath, lines.join('\n'), 'utf8');
    } catch (err) {
        exitWithError(`Error writing file ${filePath}: ${err.message}`);
    }
}

function parseStatus(line) {
    if (!line || !line.startsWith(STATUS_PREFIX)) {
        // Instead of exiting, return null if the header is missing or invalid
        return null;
    }
    return line.substring(STATUS_PREFIX.length).trim();
}

function parseTasks(line) {
    if (!line || !line.startsWith(TASKS_PREFIX)) {
        exitWithError('Invalid format on Line 2');
    }
    const jsonString = line.substring(TASKS_PREFIX.length).trim();
    try {
        const tasks = JSON.parse(jsonString);
        if (!Array.isArray(tasks)) {
             exitWithError('Invalid format on Line 2: Not a JSON array.');
        }
        return tasks;
    } catch (e) {
        exitWithError(`Invalid format on Line 2: ${e.message}`);
    }
}

const args = process.argv.slice(2);
const command = args[0];
const filePath = args[1];

if (!command) {
    exitWithError('Missing command');
}
if (!filePath) {
    exitWithError(`Missing arguments for command ${command}: file_path`);
}

switch (command) {
    case 'getStatus': {
        const lines = readFileLines(filePath);
        const status = parseStatus(lines[0]);
        if (status === null) {
            exitWithError('ERR_NO_STATUS_HEADER');
        }
        console.log(JSON.stringify(status));
        break;
    }

    case 'setStatus': {
        const newStatus = args[2];
        if (!newStatus) {
            exitWithError('Missing arguments for command setStatus: new_status_value');
        }
        const lines = readFileLines(filePath);        
        lines[0] = `${STATUS_PREFIX}${newStatus}`;
        writeFileLines(filePath, lines);
        console.log(JSON.stringify({ success: true, status: newStatus }));
        break;
    }

    case 'getPendingTasks': {
        const lines = readFileLines(filePath);        
        const tasks = parseTasks(lines[1]);
        console.log(JSON.stringify(tasks));
        break;
    }

    case 'completeTask': {
        const taskIdToComplete = args[2];
        if (!taskIdToComplete) {
            exitWithError('Missing arguments for command completeTask: task_id_to_complete');
        }
        const lines = readFileLines(filePath);
        const tasks = parseTasks(lines[1]);

        const initialLength = tasks.length;
        const remainingTasks = tasks.filter(task => task !== taskIdToComplete);

        if (remainingTasks.length === initialLength) {
            exitWithError('Task ID not found in pending tasks');
        }

        lines[1] = `${TASKS_PREFIX}${JSON.stringify(remainingTasks)}`;
        writeFileLines(filePath, lines);
        console.log(JSON.stringify({ success: true, removed: taskIdToComplete, remaining: remainingTasks }));
        break;
    }

    case 'initializeStatus': {
        const lines = readFileLines(filePath);
        // Check if status already exists to prevent duplication (optional but good practice)
        if (lines.length > 0 && lines[0].startsWith(STATUS_PREFIX)) {
             exitWithError('ERR_ALREADY_INITIALIZED'); // Or just succeed silently
        }
        const newLines = [
            `${STATUS_PREFIX}initialized`, // Or another default status
            `${TASKS_PREFIX}[]`,
            ...lines // Prepend to existing content
        ];
        writeFileLines(filePath, newLines);
        console.log(JSON.stringify({ success: true, message: 'Story status initialized.' }));
        break;
    }

    default:
        exitWithError(`Unknown command: ${command}`);
}