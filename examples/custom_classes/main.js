const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
const {Calendar, CalendarControls} = require('react-yearly-calendar');
const safeEval = require('notevil')

class Demo extends React.Component {
  constructor(props) {
    super(props);

    var today = moment();

    var customCSSclasses = {
      holidays: [
        '2017-04-25',
        '2017-05-01',
        '2017-06-02',
        '2017-08-15',
        '2017-11-01'
      ],
      spring: {
        start: '2017-03-21',
        end: '2017-6-20'
      },
      summer: {
        start: '2017-06-21',
        end: '2017-09-22'
      },
      autumn: {
        start: '2017-09-23',
        end: '2017-12-21'
      },
      weekend: 'Sat,Sun',
      winter: day => day.isBefore( moment([2017,2,21]) ) || day.isAfter( moment([2017,11,21]))
    }
    // alternatively, customClasses can be a function accepting a moment object
    //var customCSSclasses = day => ( day.isBefore( moment([day.year(),2,21]) ) || day.isAfter( moment([day.year(),11,21]) ) ) ? 'winter': 'summer'

    this.state = {
      year: today.year(),
      selectedDay: today,
      selectedRange: [today, moment(today).add(15, 'day') ],
      showDaysOfWeek: true,
      showTodayBtn: true,
      showWeekSeparators: true,
      selectRange: false,
      firstDayOfWeek: 0, // sunday
      customCSSclasses
    };
  }

  onPrevYear() {
    this.setState({ year: this.state.year-1 });
  }

  onNextYear() {
    this.setState({ year: this.state.year+1 });
  }

  goToToday() {
    var today = moment();

    this.setState({
      selectedDay: today,
      selectedRange: [today, moment(today).add(15, 'day') ],
      year: today.year()
    });
  }

  datePicked(date, classes) {
    this.setState({
      selectedDay: date,
      selectedRange: [date, moment(date).add(15, 'day') ],
    });
  }

  rangePicked(start, end) {
    this.setState({
      selectedRange: [ start, end ],
      selectedDay: start
    });
  }

  toggleShowDaysOfWeek() {
    this.setState({ showDaysOfWeek: !this.state.showDaysOfWeek });
  }

  toggleForceFullWeeks(){
    var next_forceFullWeeks = !this.state.forceFullWeeks;
    this.setState({
      showDaysOfWeek: next_forceFullWeeks,
      forceFullWeeks: next_forceFullWeeks
    });
  }

  toggleShowTodayBtn() {
    this.setState({ showTodayBtn: !this.state.showTodayBtn });
  }

  toggleShowWeekSeparators() {
    this.setState({ showWeekSeparators: !this.state.showWeekSeparators });
  }

  toggleSelectRange() {
    this.setState({ selectRange: !this.state.selectRange });
  }

  selectFirstDayOfWeek(e) {
    this.setState({ firstDayOfWeek: parseInt(event.target.value) });
  }

  updateClasses() {
    var { customCSSclasses } = this.state;
    var input = this.refs.customClassesInput.value;
    var context = { customCSSclasses, moment }

    try {
      safeEval( input, context );

      customCSSclasses = context.customCSSclasses;
      this.setState({
        customCSSclasses,
        customClassesError: false
      });
    } catch (e) {
      this.setState({
        customClassesError: true
      });
      throw e;
    }
  }

  render() {
    var { year, showTodayBtn, selectedDay, showDaysOfWeek, forceFullWeeks, showWeekSeparators, firstDayOfWeek, selectRange, selectedRange, customCSSclasses } = this.state;

    return (
      <div>
        <div id='calendar'>
          <CalendarControls
            year={year}
            showTodayButton={showTodayBtn}
            onPrevYear={() => this.onPrevYear()}
            onNextYear={() => this.onNextYear()}
            goToToday={() => this.goToToday()}
          />
          <Calendar
            year={year}
            selectedDay={selectedDay}
            showDaysOfWeek={showDaysOfWeek}
            forceFullWeeks={forceFullWeeks}
            showWeekSeparators={showWeekSeparators}
            firstDayOfWeek={firstDayOfWeek}
            selectRange={selectRange}
            selectedRange={selectedRange}
            onPickDate={(date, classes) => this.datePicked(date, classes)}
            onPickRange={(start, end) => this.rangePicked(start, end)}
            customClasses={customCSSclasses}
          />
        </div>

        <h5>Proudly brought to you by <a href='http://belka.us/en'>Belka</a></h5>

        <div className='options'>
          <div className='half'>
            <b>Demo Options</b>
            <br />
            <ul>
              <li>
                <input
                  id='showDaysOfWeek'
                  type='checkbox'
                  checked={showDaysOfWeek}
                  onChange={() => this.toggleShowDaysOfWeek()}
                />
                <label htmlFor='showDaysOfWeek'>Show days of week</label>
              </li>
              <li>
                <input
                  id='forceFullWeeks'
                  type='checkbox'
                  checked={forceFullWeeks}
                  onChange={() => this.toggleForceFullWeeks()}
                />
                <label htmlFor='forceFullWeeks'>Force full weeks</label>
              </li>
              <li>
                <input
                  id='showTodayBtn'
                  type='checkbox'
                  checked={showTodayBtn}
                  onChange={() => this.toggleShowTodayBtn()}
                />
                <label htmlFor='showTodayBtn'>Show 'Today' button</label>
              </li>
              <li>
                <input
                  id='showWeekSeparators'
                  type='checkbox'
                  checked={showWeekSeparators}
                  onChange={() => this.toggleShowWeekSeparators()}
                />
              <label htmlFor='showWeekSeparators'>Show week separators</label>
              </li>
              <li>
                <label htmlFor='firstDayOfWeek'>First day of week</label>
                <select
                  id='firstDayOfWeek'
                  value={firstDayOfWeek}
                  onChange={(e) => this.selectFirstDayOfWeek(e)}
                >
                  {[0,1,2,3,4,5,6].map( i =>
                    <option key={i} value={i}>{moment().weekday(i).format('ddd')}</option>
                  )}
                </select>
              </li>
              <li>
                <input
                  id='selectRange'
                  type='checkbox'
                  checked={selectRange}
                  onChange={() => this.toggleSelectRange()}
                />
                <label htmlFor='selectRange'>Select Date range</label>
              </li>
            </ul>
            <br />
            <i>All these options are available as Calendar props. Colors are assigned with<br/>
            an object mapping class names to week days, periods or single days.</i>
          </div>
          <div className='half'>
            <b>Custom classes mapping</b>
            <p className='interactiveDemo'>Available classes (already styled in the CSS) are: <i>holidays</i>, <i>spring</i>, <i>summer</i>,<br/> <i>autumn</i>, <i>winter</i>, <i>weekend</i>. Other classes will be applied, but will have<br/> no visual difference until you apply some styling to them.</p>
            <textarea ref='customClassesInput' className={this.state.customClassesError? 'error' : ''}>
              {
  `customCSSclasses = {
    holidays: [
      '2017-04-25',
      '2017-05-01',
      '2017-06-02',
      '2017-08-15',
      '2017-11-01'
    ],
    spring: {
      start: '2017-03-21',
      end: '2017-6-20'
    },
    summer: {
      start: '2017-06-21',
      end: '2017-09-22'
    },
    autumn: {
      start: '2017-09-23',
      end: '2017-12-21'
    },
    weekend: 'Sat,Sun',
    winter: function(day) { return day.isBefore( moment([2017,2,21]) ) || day.isAfter( moment([2017,11,21])) }
  }`
              }
            </textarea>
            <button onClick={() => this.updateClasses()}>Update</button>
            <a href="https://github.com/BelkaLab/react-yearly-calendar#custom-daysperiods-colors" target="_blank">Reference</a>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('demo')
);
