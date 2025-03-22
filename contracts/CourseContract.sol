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

    struct Classroom {
        uint id;
        string name;
        string building;
        uint capacity;
        bool isActive;
    }

    struct Schedule {
        uint id; // Add id field
        uint8 day;
        uint8 startHour;
        uint8 endHour;
        string courseName; // Add courseName field
        bool isActive; // Add isActive field
        uint classroomId; // Reference to the classroom
        address professor; // Added professor field to track assigned professor
    }

    struct Course {
        uint id;
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
    mapping(uint => Schedule) public schedulesById; // Nuevo mapeo para Schedule por ID
    mapping(uint => Classroom) public classrooms; // Mapping for classrooms
    uint public totalCourses;
    uint public totalSchedules; // Contador total de schedules
    uint public totalClassrooms; // Counter for classrooms

    address public admin;

    event CourseCreated(uint id, string name);
    event CourseDeleted(uint id);
    event CourseUpdated(uint id, string name);
    event ScheduleAdded(uint id, uint8 day, uint8 startHour, uint8 endHour);
    event ScheduleUpdated(uint courseId, uint scheduleId, uint8 day, uint8 startHour, uint8 endHour);
    event UserRegistered(address addr, Role role);
    event StudentRegisteredInCourse(uint courseId, address student);
    event ClassroomCreated(uint id, string name);
    event ClassroomUpdated(uint id, string name);
    event ClassroomDeleted(uint id);
    event ClassroomAssignedToSchedule(uint scheduleId, uint classroomId);
    event ProfessorAssignedToSchedule(uint scheduleId, address professor);
    event ProfessorUpdated(address professor, string info);

    constructor() {
        admin = msg.sender;
        users[msg.sender] = User(msg.sender, Role.Administrator, true);
    }

    function registerUser(address _user, Role _role) public {
        require(!users[_user].isActive, "User already registered");
        User storage newUser = users[_user];
        newUser.addr = _user;
        newUser.role = _role;
        newUser.isActive = true;
        emit UserRegistered(_user, _role);
    }

    function getUser(address _user) public view returns (User memory) {
        require(users[_user].isActive, "User not registered");
        User memory user = users[_user];
        return user;
    }

    function isRegistered(address _user) public view returns (bool) {
        return users[_user].isActive;
    }

    function createCourse(string memory _name, string memory _description, uint _credits) public {
        uint courseId = totalCourses++;
        Course storage newCourse = courses[courseId];
        newCourse.id = courseId;
        newCourse.name = _name;
        newCourse.description = _description;
        newCourse.credits = _credits;
        newCourse.isActive = true;
        newCourse.totalSchedules = 0;
        emit CourseCreated(courseId, _name);
    }

    function getCourse(uint _id) public view returns (uint, string memory, string memory, uint, bool, uint) {
        require(_id < totalCourses, "Invalid course ID");
    
        Course storage course = courses[_id];
        return (course.id, course.name, course.description, course.credits, course.isActive, course.totalSchedules);
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

    function addSchedule(uint _id, uint8 _day, uint8 _startHour, uint8 _endHour, uint _classroomId, address _professor) public {
        require(_id < totalCourses, "Invalid course ID");
        require(courses[_id].isActive, "Course does not exist or has been deleted");
        require(_day >= 1 && _day <= 7, "Invalid day");
        require(_startHour < 24 && _endHour < 24 && _startHour < _endHour, "Invalid schedule");
        require(_classroomId < totalClassrooms, "Invalid classroom ID");
        require(classrooms[_classroomId].isActive, "Classroom does not exist or has been deleted");
        
        // Only verify professor if one is provided (address(0) means no professor assigned)
        if (_professor != address(0)) {
            require(users[_professor].isActive, "Professor must be registered");
            require(users[_professor].role == Role.Professor, "Assigned user must be a professor");
        }

        Course storage course = courses[_id];
        uint scheduleId = course.totalSchedules + 1;
        // added course
        Schedule storage newSchedule = course.schedules[scheduleId];
        newSchedule.id = scheduleId;
        newSchedule.day = _day;
        newSchedule.startHour = _startHour;
        newSchedule.endHour = _endHour;
        newSchedule.courseName = course.name;
        newSchedule.isActive = true;
        newSchedule.classroomId = _classroomId;
        newSchedule.professor = _professor; // Add professor assignment
        course.totalSchedules = scheduleId; // Actualizar el total de schedules
        
        // added to schedulesById mapping
        Schedule storage schedule = schedulesById[totalSchedules];
        schedule.id = totalSchedules;
        schedule.day = _day;
        schedule.startHour = _startHour;
        schedule.endHour = _endHour;
        schedule.courseName = course.name;
        schedule.isActive = true;
        schedule.classroomId = _classroomId;
        schedule.professor = _professor; // Add professor assignment
        
        totalSchedules++; // Incrementar el contador total de schedules
        emit ScheduleAdded(_id, _day, _startHour, _endHour);
        emit ClassroomAssignedToSchedule(scheduleId, _classroomId);
        
        if (_professor != address(0)) {
            emit ProfessorAssignedToSchedule(scheduleId, _professor);
        }
    }


    function getSchedule(uint _courseId, uint _scheduleId) public view returns (uint, uint8, uint8, uint8, string memory, bool, uint, address) {
        require(_courseId < totalCourses, "Invalid course ID");
        require(courses[_courseId].isActive, "Course does not exist or has been deleted");
        require(_scheduleId <= courses[_courseId].totalSchedules, "Invalid schedule ID");

        Schedule storage schedule = courses[_courseId].schedules[_scheduleId];
        return (schedule.id, schedule.day, schedule.startHour, schedule.endHour, schedule.courseName, schedule.isActive, schedule.classroomId, schedule.professor);
    }

    function getScheduleById(uint _scheduleId) public view returns (uint, uint8, uint8, uint8, string memory, bool, uint, address) {
        require(_scheduleId < totalSchedules, "Invalid schedule ID");
        Schedule storage schedule = schedulesById[_scheduleId];
        return (schedule.id, schedule.day, schedule.startHour, schedule.endHour, schedule.courseName, schedule.isActive, schedule.classroomId, schedule.professor);
    }

    function updateSchedule(uint _courseId, uint _scheduleId, uint8 _day, uint8 _startHour, uint8 _endHour, uint _classroomId, address _professor) public {
        require(_courseId < totalCourses, "Invalid course ID");
        require(courses[_courseId].isActive, "Course does not exist or has been deleted");
        require(_scheduleId <= courses[_courseId].totalSchedules, "Invalid schedule ID");
        require(_day >= 1 && _day <= 7, "Invalid day");
        require(_startHour < 24 && _endHour < 24 && _startHour < _endHour, "Invalid schedule");
        require(_classroomId < totalClassrooms, "Invalid classroom ID");
        require(classrooms[_classroomId].isActive, "Classroom does not exist or has been deleted");
        
        // Only verify professor if one is provided
        if (_professor != address(0)) {
            require(users[_professor].isActive, "Professor must be registered");
            require(users[_professor].role == Role.Professor, "Assigned user must be a professor");
        }

        Schedule storage schedule = courses[_courseId].schedules[_scheduleId];
        require(schedule.isActive, "Schedule does not exist or has been deleted"); // Check if schedule is active
        schedule.day = _day;
        schedule.startHour = _startHour;
        schedule.endHour = _endHour;
        schedule.classroomId = _classroomId;
        
        // Only update professor if different from current assignment
        if (_professor != schedule.professor) {
            schedule.professor = _professor;
            emit ProfessorAssignedToSchedule(_scheduleId, _professor);
        }
        
        // courseName remains unchanged
        emit ScheduleUpdated(_courseId, _scheduleId, _day, _startHour, _endHour);
        emit ClassroomAssignedToSchedule(_scheduleId, _classroomId);
    }

    function assignClassroomToSchedule(uint _courseId, uint _scheduleId, uint _classroomId) public {
        require(_courseId < totalCourses, "Invalid course ID");
        require(courses[_courseId].isActive, "Course does not exist or has been deleted");
        require(_scheduleId <= courses[_courseId].totalSchedules, "Invalid schedule ID");
        require(_classroomId < totalClassrooms, "Invalid classroom ID");
        require(classrooms[_classroomId].isActive, "Classroom does not exist or has been deleted");

        Schedule storage schedule = courses[_courseId].schedules[_scheduleId];
        require(schedule.isActive, "Schedule does not exist or has been deleted");
        
        schedule.classroomId = _classroomId;
        emit ClassroomAssignedToSchedule(_scheduleId, _classroomId);
    }

    function deleteSchedule(uint _courseId, uint _scheduleId) public {
        require(_courseId < totalCourses, "Invalid course ID");
        require(courses[_courseId].isActive, "Course does not exist or has been deleted");
        require(_scheduleId <= courses[_courseId].totalSchedules, "Invalid schedule ID");

        Schedule storage schedule = courses[_courseId].schedules[_scheduleId];
        require(schedule.isActive, "Schedule does not exist or has been deleted");

        schedule.isActive = false;
        emit ScheduleUpdated(_courseId, _scheduleId, schedule.day, schedule.startHour, schedule.endHour); // Reuse ScheduleUpdated event
    }

    function listAllSchedules() public view returns (Schedule[] memory) {
        uint totalSchedulesCount = 0;

        for (uint i = 0; i < totalCourses; i++) {
            if (courses[i].isActive) {
                for (uint j = 0; j <= courses[i].totalSchedules; j++) {
                    if (courses[i].schedules[j].isActive) {
                        totalSchedulesCount++;
                    }
                }
            }
        }
        Schedule[] memory allSchedules = new Schedule[](totalSchedulesCount);
        uint index = 0;

        for (uint i = 0; i < totalCourses; i++) {
            if (courses[i].isActive) {
                Course storage course = courses[i];
                for (uint j = 1; j <= course.totalSchedules; j++) {
                    if (course.schedules[j].isActive) {
                        allSchedules[index] = course.schedules[j];
                        index++;
                    }
                }
            }
        }
        return allSchedules;
    }

    function registerStudentInCourses(uint[] memory _courseIds) public {
        require(users[msg.sender].role == Role.Student, "Only students can register in courses");

        for (uint i = 0; i < _courseIds.length; i++) {
            uint courseId = _courseIds[i];
            require(courseId < totalCourses, "Invalid course ID");
            require(courses[courseId].isActive, "Course does not exist or has been deleted");

            Course storage course = courses[courseId];
            bool alreadyRegistered = false;
            for (uint j = 0; j < course.students.length; j++) {
                if (course.students[j] == msg.sender) {
                    alreadyRegistered = true;
                    break;
                }
            }
            require(!alreadyRegistered, "Student already registered in one of the courses");
            course.students.push(msg.sender);
            emit StudentRegisteredInCourse(courseId, msg.sender);
        }
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

    // Classroom CRUD operations
    function createClassroom(string memory _name, string memory _building, uint _capacity) public {
        require(users[msg.sender].role == Role.Administrator, "Only administrators can create classrooms");
        
        uint classroomId = totalClassrooms++;
        Classroom storage newClassroom = classrooms[classroomId];
        newClassroom.id = classroomId;
        newClassroom.name = _name;
        newClassroom.building = _building;
        newClassroom.capacity = _capacity;
        newClassroom.isActive = true;
        
        emit ClassroomCreated(classroomId, _name);
    }

    function getClassroom(uint _id) public view returns (uint, string memory, string memory, uint, bool) {
        require(_id < totalClassrooms, "Invalid classroom ID");
        
        Classroom storage classroom = classrooms[_id];
        return (classroom.id, classroom.name, classroom.building, classroom.capacity, classroom.isActive);
    }

    function updateClassroom(uint _id, string memory _name, string memory _building, uint _capacity) public {
        require(users[msg.sender].role == Role.Administrator, "Only administrators can update classrooms");
        require(_id < totalClassrooms, "Invalid classroom ID");
        require(classrooms[_id].isActive, "Classroom does not exist or has been deleted");
        
        Classroom storage classroom = classrooms[_id];
        classroom.name = _name;
        classroom.building = _building;
        classroom.capacity = _capacity;
        
        emit ClassroomUpdated(_id, _name);
    }

    function deleteClassroom(uint _id) public {
        require(users[msg.sender].role == Role.Administrator, "Only administrators can delete classrooms");
        require(_id < totalClassrooms, "Invalid classroom ID");
        require(classrooms[_id].isActive, "Classroom does not exist or has been deleted");
        
        classrooms[_id].isActive = false;
        emit ClassroomDeleted(_id);
    }

    function listClassrooms() public view returns (uint[] memory) {
        uint[] memory activeClassrooms = new uint[](totalClassrooms);
        uint count = 0;
        
        for (uint i = 0; i < totalClassrooms; i++) {
            if(classrooms[i].isActive) {
                activeClassrooms[count] = i;
                count++;
            }
        }
        
        uint[] memory result = new uint[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = activeClassrooms[i];
        }
        
        return result;
    }

    // Add a function to assign a professor to a schedule
    function assignProfessorToSchedule(uint _courseId, uint _scheduleId, address _professor) public {
        require(users[msg.sender].role == Role.Administrator, "Only administrators can assign professors");
        require(_courseId < totalCourses, "Invalid course ID");
        require(courses[_courseId].isActive, "Course does not exist or has been deleted");
        require(_scheduleId <= courses[_courseId].totalSchedules, "Invalid schedule ID");
        require(users[_professor].isActive, "Professor must be registered");
        require(users[_professor].role == Role.Professor, "Assigned user must be a professor");

        Schedule storage schedule = courses[_courseId].schedules[_scheduleId];
        require(schedule.isActive, "Schedule does not exist or has been deleted");
        
        schedule.professor = _professor;
        
        // Also update in the schedulesById mapping
        for (uint i = 0; i < totalSchedules; i++) {
            if (schedulesById[i].id == _scheduleId) {
                schedulesById[i].professor = _professor;
                break;
            }
        }
        
        emit ProfessorAssignedToSchedule(_scheduleId, _professor);
    }

    // Function to get all schedules assigned to a professor
    function getProfessorSchedules(address _professor) public view returns (Schedule[] memory) {
        require(users[_professor].isActive, "Professor not registered");
        require(users[_professor].role == Role.Professor, "User must be a professor");
        
        // First count how many schedules this professor has
        uint professorScheduleCount = 0;
        for (uint i = 0; i < totalSchedules; i++) {
            if (schedulesById[i].isActive && schedulesById[i].professor == _professor) {
                professorScheduleCount++;
            }
        }
        
        // Create and populate array with professor's schedules
        Schedule[] memory professorSchedules = new Schedule[](professorScheduleCount);
        uint index = 0;
        
        for (uint i = 0; i < totalSchedules; i++) {
            if (schedulesById[i].isActive && schedulesById[i].professor == _professor) {
                professorSchedules[index] = schedulesById[i];
                index++;
            }
        }
        
        return professorSchedules;
    }

    // Add function to get all courses taught by a professor
    function getProfessorCourses(address _professor) public view returns (uint[] memory) {
        require(users[_professor].isActive, "Professor not registered");
        require(users[_professor].role == Role.Professor, "User must be a professor");
        
        uint[] memory professorCourses = new uint[](totalCourses);
        uint count = 0;
        
        // Check each course
        for (uint i = 0; i < totalCourses; i++) {
            if (courses[i].isActive) {
                bool courseFound = false;
                // Check schedules within the course for the professor
                for (uint j = 1; j <= courses[i].totalSchedules && !courseFound; j++) {
                    if (courses[i].schedules[j].isActive && courses[i].schedules[j].professor == _professor) {
                        professorCourses[count] = i;
                        count++;
                        courseFound = true;
                    }
                }
            }
        }
        
        uint[] memory result = new uint[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = professorCourses[i];
        }
        
        return result;
    }
}
