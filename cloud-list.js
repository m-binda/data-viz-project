function CloudList() {

    this.makeCloud = function (book) {
        let words = join(book);
        let wordCloud = [];

        // Minimum word length
        let wordLength = 3;

        words = split(words, " ");
        for (let i = 0; i < words.length; i++) {
            if (words[i].length > wordLength) {
                if ((wordCloud.find(x => x.name === words[i].toUpperCase())) === undefined) {
                    let word = new WordCloud(
                        words[i].toUpperCase()
                    );
                    wordCloud.push(word)
                } else {
                    wordCloud.find(x => x.name === words[i].toUpperCase()).quantity += 1;
                }
            }
        };
        wordCloud.sort((a, b) => b.quantity - a.quantity);

        return wordCloud;
    }
}