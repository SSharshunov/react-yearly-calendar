import React from 'react';
import moment from 'moment';
import { Month } from './Month';
import { range } from './utils';

const propTypes = {
  year: React.PropTypes.number.isRequired,
  forceFullWeeks: React.PropTypes.bool,
  showDaysOfWeek: React.PropTypes.bool,
  showWeekSeparators: React.PropTypes.bool,
  firstDayOfWeek: React.PropTypes.number,
  selectRange: React.PropTypes.bool,
  onPickDate: React.PropTypes.func,
  onPickRange: React.PropTypes.func,
  customClasses: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.func
  ])
};

const defaultProps = {
  year: moment().year(),
  forceFullWeeks: false,
  showDaysOfWeek: true,
  showWeekSeparators: true,
  firstDayOfWeek: 0,
  selectRange: false,
  onPickDate: null,
  onPickRange: null,
  selectedDay: moment(),
  customClasses: null
};

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectingRange: undefined
    }
  }

  dayClicked(date, classes) {
    let { selectingRange , useless } = this.state;
    const { selectRange, onPickRange, onPickDate } = this.props;

    if( !selectRange ) {
      onPickDate && onPickDate(date, classes);
      return;
    }

    if( !selectingRange ) {
      selectingRange = [date, date];
    } else {
      if( selectingRange[0] > date ) {
        onPickRange && onPickRange(date, selectingRange[0]);
      } else {
        onPickRange && onPickRange(selectingRange[0], date);
      }
      selectingRange = undefined;
    }

    this.setState({
      selectingRange
    })
  }

  dayHovered(hoveredDay) {
    let { selectingRange } = this.state;

    if( selectingRange ) {
      selectingRange[ 1 ] = hoveredDay;

      this.setState({
        selectingRange
      });
    }
  }

  _daysOfWeek() {
    const { firstDayOfWeek, forceFullWeeks, showWeekSeparators } = this.props;
    const totalDays = forceFullWeeks? 42: 37;

    const days = [];
    range(firstDayOfWeek, totalDays + firstDayOfWeek).map( i => {
      let day = moment().weekday(i).format('dd').charAt(0);

      if( showWeekSeparators ) {
        if(i%7 === firstDayOfWeek && days.length)  {
          // push week separator
          days.push(
            <th
              className='week-separator'
              key={`seperator-${i}`}
            />
          )
        }
      }
      days.push (
        <th
          key={`weekday-${i}`}
          className={ i%7 === 0 ? 'bolder': ''}
        >
          {day}
        </th>
      )
    });

    return (
      <tr>
        <th>&nbsp;</th>
        {days}
      </tr>
    )
  }

  render() {
    const { year, firstDayOfWeek } = this.props;
    const { selectingRange } = this.state;

    const months = range(9,10,11,12,1,2,3,4,5,6,7,8).map( month =>
      <Month
        month={month}
        key={`month-${month}`}
        dayClicked={(d, classes) => this.dayClicked(d, classes)}
        dayHovered={(d) => this.dayHovered(d)}
        {...this.props}
        selectingRange={selectingRange}
      />
    );

    return (
      <table className='calendar'>
        <thead className='day-headers'>
          {this.props.showDaysOfWeek ? this._daysOfWeek() : null}
        </thead>
        <tbody>
          {months}
        </tbody>
      </table>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;
