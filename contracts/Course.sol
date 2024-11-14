// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract CourseContract {

    enum Role { Student, Professor, Administrator }

    struct User {
        address addr;
        Role role;
        bool isActive;
    }

    struct Schedule {
        uint8 day;
        uint8 startHour;
        uint8 endHour;
    }

    struct Course {
        string name;
        string description;
        uint credits;
        bool isActive;
        uint totalSchedules;
        address[] students;
        mapping(uint => Schedule) schedules;
    }

    mapping(uint => Course) public courses;
    mapping(address => User) public users;
    uint public totalCourses;

    address public admin;

    event CourseCreated(uint id, string name);
    event CourseDeleted(uint id);
    event CourseUpdated(uint id, string name);
    event ScheduleAdded(uint id, uint8 day, uint8 startHour, uint8 endHour);
    event UserRegistered(address addr, Role role);
    event StudentRegisteredInCourse(uint courseId, address student);

    constructor() {
        admin = msg.sender;
        users[msg.sender] = User(msg.sender, Role.Administrator, true);
    }

    function registerUser(address _user, Role _role) public {
        require(!users[_user].isActive, "User already registered");
        users[_user] = User(_user, _role, true);
        emit UserRegistered(_user, _role);
    }

    function createCourse(string memory _name, string memory _description, uint _credits) public {
        uint courseId = totalCourses++;
        Course storage newCourse = courses[courseId];
        newCourse.name = _name;
        newCourse.description = _description;
        newCourse.credits = _credits;
        newCourse.isActive = true;
        newCourse.totalSchedules = 0;
        emit CourseCreated(courseId, _name);
    }

    function getCourse(uint _id) public view returns (string memory, string memory, uint, bool, uint) {
        require(_id < totalCourses, "Invalid course ID");
    
        Course storage course = courses[_id];
        return (course.name, course.description, course.credits, course.isActive, course.totalSchedules);
    }

    function updateCourse(uint _id, string memory _name, string memory _description, uint _credits) public {
        require(_id < totalCourses, "Invalid course ID");
        require(courses[_id].isActive, "Course does not exist or has been deleted");

        Course storage course = courses[_id];
        course.name = _name;
        course.description = _description;
        course.credits = _credits;

        emit CourseUpdated(_id, _name);
    }

    function deleteCourse(uint _id) public {
        require(_id < totalCourses, "Invalid course ID");
        require(courses[_id].isActive, "Course does not exist or has been deleted");

        courses[_id].isActive = false;
        emit CourseDeleted(_id);
    }

    function listCourses() public view returns (uint[] memory) {
        uint[] memory activeCourses = new uint[](totalCourses);
        uint count = 0;

        for (uint i = 0; i < totalCourses; i++) {
            if(courses[i].isActive) {
                activeCourses[count] = i;
                count++;
            }
        }

        uint[] memory result = new uint[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = activeCourses[i];
        }

        return result;
    }

    function addSchedule(uint _id, uint8 _day, uint8 _startHour, uint8 _endHour) public {
        require(_id < totalCourses, "Invalid course ID");
        require(courses[_id].isActive, "Course does not exist or has been deleted");
        require(_day >= 1 && _day <= 7, "Invalid day");
        require(_startHour < 24 && _endHour < 24 && _startHour < _endHour, "Invalid schedule");

        Course storage course = courses[_id];
        uint scheduleId = course.totalSchedules + 1;
        course.schedules[scheduleId] = Schedule(_day, _startHour, _endHour);
        course.totalSchedules = scheduleId;
        emit ScheduleAdded(_id, _day, _startHour, _endHour);
    }

    function getSchedule(uint _courseId, uint _scheduleId) public view returns (uint8, uint8, uint8) {
        require(_courseId < totalCourses, "Invalid course ID");
        require(courses[_courseId].isActive, "Course does not exist or has been deleted");
        require(_scheduleId <= courses[_courseId].totalSchedules, "Invalid schedule ID");

        Schedule storage schedule = courses[_courseId].schedules[_scheduleId];
        return (schedule.day, schedule.startHour, schedule.endHour);
    }

    function registerStudentInCourse(uint _courseId) public {
        require(_courseId < totalCourses, "Invalid course ID");
        require(courses[_courseId].isActive, "Course does not exist or has been deleted");
        require(users[msg.sender].role == Role.Student, "Only students can register in courses");

        Course storage course = courses[_courseId];
        for (uint i = 0; i < course.students.length; i++) {
            require(course.students[i] != msg.sender, "Student already registered in the course");
        }
        course.students.push(msg.sender);
        emit StudentRegisteredInCourse(_courseId, msg.sender);
    }

    function getStudentCourses() public view returns (uint[] memory) {
        require(users[msg.sender].isActive, "User not registered");
        require(users[msg.sender].role == Role.Student, "Only students can have enrolled courses");
        uint[] memory studentCourses = new uint[](totalCourses);
        uint count = 0;

        for (uint i = 0; i < totalCourses; i++) {
            Course storage course = courses[i];
            for (uint j = 0; j < course.students.length; j++) {
                if(course.students[j] == msg.sender) {
                    studentCourses[count] = i;
                    count++;
                    break;
                }
            }
        }

        uint[] memory result = new uint[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = studentCourses[i];
        }

        return result;
    }

}
