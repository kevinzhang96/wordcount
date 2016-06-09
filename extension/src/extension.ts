// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import {window, commands, Disposable, ExtensionContext, TextDocument} from 'vscode';
var fs = require("fs");
var request = require("request");

var wordCounter, controller;

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    // create a new word counter

    wordCounter = new WordCounter(+new Date());
    controller = new WordCounterController(wordCounter);

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(wordCounter);

    console.log(context.subscriptions)
}

class WordCounter {

    private _streakTimeout;
    private _streak = null;
    private _filePath: string;
    private path =  require("path").join(__dirname, "..", "data");

    constructor(date: number) {
        this._filePath =  require("path").join(__dirname, "..", "..", "data", `${date}.csv`);
        fs.writeFile(this._filePath, "start,filename,keystrokes,length\n", (err, data) => {
            if(err) console.error(err)
        });
    }

    public updateWordCount() {

        if(this._streak === null) {
            this._startStreak()
        } else {
            clearTimeout(this._streakTimeout);
        }
        this._streakTimeout = setTimeout(this._endStreak.bind(this), 3 * 1000);
        this._streak.length++;
    }

    public handleNewFile() {
        this._endStreak();
    }

    private _startStreak() {
        console.log("Starting streak")
        this._streak = {
            start: +new Date(),
            length: 0,
            filename: window.activeTextEditor.document.fileName.split(/[\\\/]/).pop()
        }
    }

    private _endStreak() {
        if(this._streak === null) {
            return; 
        }
        console.log("Ending streak")
        var currentDate = +new Date();
        var streakLength = currentDate - this._streak.start;
        console.log(`${this._streak.filename}: ${this._streak.length} keystrokes in ${streakLength} ms`) 
        fs.appendFile(this._filePath, `${this._streak.start},${this._streak.filename},${this._streak.length},${streakLength}\n`);
        this._streak = null;

    }

    dispose() {
        fs.readFile(this._filePath, 'utf8', (err, data) => {
            console.log(data);
        })
        fs.unlink(this._filePath)
    }
}

class WordCounterController {

    private _wordCounter: WordCounter;
    private _disposable: Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._update, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._newFile, this, subscriptions);

        // update the counter for the current file
        this._wordCounter.updateWordCount();

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _update() {
        this._wordCounter.updateWordCount();
    }
    
    private _newFile() {
        this._wordCounter.handleNewFile();
    }
}