window.onload = function(){

var audioCtx = new window.AudioContext();

var oscElement1 = document.querySelector('.osc1');
var oscillator1 = new Osc(oscElement1, audioCtx);

var oscElement2 = document.querySelector('.osc2');
var oscillator2 = new Osc(oscElement2, audioCtx);

var lfoElement = document.querySelector('.lfo');
var lfo = new LFO(lfoElement, audioCtx);

var filterElement = document.querySelector('.filter');
var filter = new Filter(filterElement, audioCtx);

var ampElement = document.querySelector('.amp');
var amp = new Amp(ampElement, audioCtx);

var scopeElement = document.querySelector('.scopeModule');
var doubleScope = new DoubleScope(scopeElement, audioCtx);

oscillator1.connect(amp.input);
oscillator2.connect(amp.input);

amp.connect(filter.input);
doubleScope.monitor(filter.input);

filter.connect(audioCtx.destination);

var envelopes = [amp.envelope, filter.envelope];

var midiHandler = new MidiHandler();
midiHandler.onnoteon = (frequency => {
  oscillator1.freq = frequency;
  oscillator2.freq = frequency;
  envelopes.forEach(envelope => envelope.trigger(frequency));
});

midiHandler.onnoteoff = (frequency => {
  envelopes.forEach(envelope => envelope.releaseNote(frequency));
});

var lfoControls = lfoElement.querySelectorAll('.destinationControl');
var updateLFO = function() {
    lfoControls.forEach(destinationControl => {
      if (destinationControl.checked) {
        lfo.disconnect();
        switch(destinationControl.value) {
          case 'pitch':
            lfo.connect(oscillator1.osc.frequency);
            lfo.connect(oscillator2.osc.frequency);
            break;
          case 'volume':
            lfo.connect(amp.amp.gain);
            break;
          case 'cutoff':
            lfo.connect(filter.filter.frequency);
            break;
          default:
            lfo.disconnect();
        }
        this.oscillator.type = waveformControl.value;
      };
    });
}

// Routing for the LFO
lfoControls.forEach(lfoControl => lfoControl.onchange = updateLFO);
};

