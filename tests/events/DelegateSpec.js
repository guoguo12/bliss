function click(element) {
	var ev = document.createEvent("MouseEvent");
	ev.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	return element.dispatchEvent(ev);
}

describe("$.delegate", function() {
	describe("$.delegate in subject-type-selector-callback form", function() {
		it("adds events to the children of the subject", function(done) {
			var subject = document.createElement("div");
			var inner = document.createElement("a");
			subject.appendChild(inner);

			$.delegate(subject, "click", "a", function() {
				done();
			});
			click(inner);
		});

		it("can be called on elements", function(done) {
			var subject = document.createElement("div");
			var inner = document.createElement("a");
			subject.appendChild(inner);

			subject._.delegate("click", "a", function() {
				done();
			});
			click(inner);
		});

		it("can be called on arrays", function(done) {
			var subjects = [
				document.createElement("div"), // div 1
				document.createElement("div"), // div 2
				document.createElement("div")  // div 3
			];
			var inners = [
				document.createElement("a"), // goes inside div 1
				document.createElement("a"), // goes inside div 2
				document.createElement("a")  // goes inside div 3
			];
			subjects.forEach(function(subject, index) {
				subject.appendChild(inners[index]);
			});

			var callbackSpy = sinon.spy(function() {
				var expectedSubject = subjects[callbackSpy.callCount - 1];
				expect(this).to.equal(expectedSubject);

				if (callbackSpy.calledThrice) {
					done();
				}
			});
			subjects._.delegate("click", "a", callbackSpy);
			subjects.forEach(click); // shouldn't trigger callbacks
			inners.forEach(click);   // should trigger callbacks
		});
	});
});
