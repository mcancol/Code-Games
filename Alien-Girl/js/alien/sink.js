/**
 * Accepts and buffers player movement data
 * and periodically sends it to the data sink.
 *
 * @param {Integer} Game identifier
 * @param {String} Name of the current level
 */
function Sink(sinkAddress, start, level)
{
  this.sendingInProgress = false;
  this.sinkAddress = sinkAddress;

  this.transmitAutomatically = true;
  this.transmitEvery = 1;

  this.start = start;
  this.level = level;

  this.id = 0;
  this.buffer = {};


  /**
   * Append data to buffer.
   */
  this.appendData = function(data)
  {
    data.id = this.id;
    this.buffer[this.id] = data;
    this.id++;

    if(this.transmitAutomatically && (this.id % this.transmitEvery) == 0)
      this.transmitData();
  }


  /**
   * Explicitly attempt to transmit data to server.
   */
  this.transmitData = function()
  {
    if(this.sendingInProgress)
      return;

    this.sendingInProgress = true;

    // Send moves to server
    jQuery.ajax({
      url: this.sinkAddress + "?game=" + this.start + "&level=" + this.level,
      data: JSON.stringify(this.buffer),
      contentType: 'text/plain',
      dataType: 'json',
      method: 'POST'
    }).done(function(result) {
      // Remove moves from buffer that were successfully sent
      for(var i in result) {
        if(result[i] in this.buffer)
          delete(this.buffer[ result[i] ]);
      }

      this.sendingInProgress = false;
    }.bind(this)).fail(function() {
      this.sendingInProgress = false;
    }.bind(this));
  }
}
