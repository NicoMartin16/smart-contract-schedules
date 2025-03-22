import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { assert, expect } from "chai";
import { createTestClient, http } from 'viem';
import hre, { viem } from "hardhat";
import { hardhat } from 'viem/chains';
import { privateKeyToAccount } from "viem/accounts";

describe("CourseManagementContract", () => {

    async function deployCourseManagementContractFixture() {
        const courseContract = await hre.viem.deployContract("CourseContract");
        const client = createTestClient({
            account: privateKeyToAccount('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'),
            chain: hardhat,
            mode: "hardhat",
            transport: http(),

        });
        return { courseContract, client };
    }
    
    describe("Deployment", () => {

        it('should register a new student', async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            // // Act
            await courseContract.write.registerUser([client.account.address, 0]);
            // // Assert
            const newUser = await courseContract.read.users([client.account.address]) as any[];
            assert.ok(newUser);
            assert.equal(newUser[0], client.account.address);
            assert.isTrue(newUser[2]);
        });
        
        it('should get a registered user', async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.registerUser([client.account.address, 0]);
            
            // Act
            const user = await courseContract.read.getUser([client.account.address]) as any;
            console.log(user);
            
            // Assert
            assert.ok(user);
            assert.equal(user.addr, client.account.address);
            assert.equal(user.role, 0); // Student role
            assert.isTrue(user.isActive); // isActive
        });

        it('should fail to get an unregistered user', async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            const unregisteredAddress = "0x1234567890123456789012345678901234567890";
            
            // Act & Assert
            await expect(courseContract.read.getUser([unregisteredAddress])).to.be.rejectedWith("User not registered");
        });

        it('should verify if a user is registered with isRegistered', async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.registerUser([client.account.address, 0]);
            const unregisteredAddress = "0x1234567890123456789012345678901234567890";
            
            // Act
            const isRegistered = await courseContract.read.isRegistered([client.account.address]);
            const isNotRegistered = await courseContract.read.isRegistered([unregisteredAddress]);
            
            // Assert
            assert.isTrue(isRegistered);
            assert.isFalse(isNotRegistered);
        });

        it("should create a new course", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            // Act
            await courseContract.write.createCourse(["Integral Calculus", "Study the principles of integral calculus", 3]);
            // Assert
            const course = await courseContract.read.courses([0]) as any[];
            assert.ok(course);
            assert.equal(course[0], 0);
            assert.equal(course[1], "Integral Calculus");
            assert.equal(course[2], "Study the principles of integral calculus");
            assert.equal(course[3], 3);
        
        });
        
        it("should get a course by id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Integral Calculus", "Study the principles of integral calculus", 3]);
            // Act
            const result = await courseContract.read.getCourse([0]) as any[];
            // Assert
            assert.equal(result[0], 0);
            assert.equal(result[1], "Integral Calculus");
            assert.equal(result[2], "Study the principles of integral calculus");
            assert.equal(result[3], "3");
            assert.isTrue(result[4]);
        });

        it("should update a course by id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Integral Calculus", "Study the principles of integral calculus", 3]);
            // Act
            const result = await courseContract.write.updateCourse([0, "Fundamentals of Integral Calculus", "Study the principles of integral calculus", 3]);
            const courseUpdated = await courseContract.read.courses([0]) as any[];
            // Assert
            assert.ok(result);
            assert.equal(courseUpdated[0], 0);
            assert.equal(courseUpdated[1], "Fundamentals of Integral Calculus");
            assert.equal(courseUpdated[2], "Study the principles of integral calculus");
            assert.equal(courseUpdated[3], 3);
        });

        it("should list created courses", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createCourse(["Vector Calculus", "Study the principles of vector calculus", 3]);
            await courseContract.write.createCourse(["Advanced Calculus", "Study the principles of advanced calculus", 3]);
            // Act
            const result = await courseContract.read.listCourses() as any[];
            // Assert
            assert.isArray(result);
            assert.lengthOf(result, 3);
            assert.equal(result[0], 0);
            assert.equal(result[1], 1);
            assert.equal(result[2], 2);
        });

        it("should delete a course by id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            // Act
            const result = await courseContract.write.deleteCourse([0]);
            const course = await courseContract.read.getCourse([0]) as any[];
            // Assert
            assert.isFalse(course[4]);
        });

        it("should add a schedule to a course by id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            // Act
            await courseContract.write.addSchedule([0, 1, 8, 10, 0]);
            const course = await courseContract.read.getCourse([0]) as any[];
            // Assert
            assert.equal(course[5], 1);
        });

        it("should get a schedule by schedule id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.addSchedule([0, 1, 8, 10, 0]);
            // Act
            const result = await courseContract.read.getScheduleById([0]) as any[];
            // Assert
            expect(result[0]).to.equal(0n);
            expect(result[1]).to.equal(1);
            expect(result[2]).to.equal(8);
            expect(result[3]).to.equal(10);
            expect(result[4]).to.equal("Differential Calculus");
            expect(result[5]).to.equal(true);
            expect(result[6]).to.equal(0n);
        });

        it("should register a student to a course", async ( ) => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);

            await courseContract.write.registerUser([client.account.address, 0]);
            const cursesIds = [0n];
            // Act
            await courseContract.write.registerStudentInCourses([cursesIds], {
                account: client.account.address,
            });
            const result = await courseContract.read.getStudentCourses({
                account: client.account.address,
            }) as any[];
            // Assert
            assert.isArray(result);
            assert.lengthOf(result, 1);
            assert.equal(result[0], 0);
        });

        it("should list all schedules", async () => {
            // arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.addSchedule([0, 1, 8, 10, 0]);
            await courseContract.write.addSchedule([0, 2, 8, 10, 0]);
            await courseContract.write.addSchedule([0, 3, 8, 10, 0]);
            await courseContract.write.addSchedule([0, 1, 6, 8, 0]);
            const result = await courseContract.read.listAllSchedules() as any[];

            assert.isArray(result);
            assert.lengthOf(result, 4);
        });
        
        it("should update data from a schedule", async () => {
            // arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.addSchedule([0, 1, 8, 10, 0]);
            await courseContract.write.createClassroom(["Room 102", "Science Building", 25]);
            
            // Act
            const result = await courseContract.write.updateSchedule([0, 1, 1, 6, 8, 1]);
            const schedule = await courseContract.read.getSchedule([0, 1]) as any[];

            // Assert
            assert.ok(result);
            assert.equal(schedule[2], 6);
            assert.equal(schedule[3], 8);
            assert.equal(schedule[6], 1);
        });

        it("should delete a schedule", async () => {
            // arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);

            // Act
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.addSchedule([0, 1, 8, 10, 0]);
            const result = await courseContract.write.deleteSchedule([0, 1]);
            const schedule = await courseContract.read.getSchedule([0, 1]) as any[];
            // assert
            assert.isFalse(schedule[5]);
        });

        // Classroom tests
        it("should create a new classroom", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            // Act
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            // Assert
            const classroom = await courseContract.read.classrooms([0]) as any[];
            assert.ok(classroom);
            assert.equal(classroom[0], 0);
            assert.equal(classroom[1], "Room 101");
            assert.equal(classroom[2], "Engineering Building");
            assert.equal(classroom[3], 30);
            assert.isTrue(classroom[4]);
        });

        it("should get a classroom by id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            // Act
            const result = await courseContract.read.getClassroom([0]) as any[];
            // Assert
            assert.equal(result[0], 0);
            assert.equal(result[1], "Room 101");
            assert.equal(result[2], "Engineering Building");
            assert.equal(result[3], 30);
            assert.isTrue(result[4]);
        });

        it("should update a classroom by id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            // Act
            const result = await courseContract.write.updateClassroom([0, "Room 102", "Science Building", 40]);
            const classroomUpdated = await courseContract.read.classrooms([0]) as any[];
            // Assert
            assert.ok(result);
            assert.equal(classroomUpdated[0], 0);
            assert.equal(classroomUpdated[1], "Room 102");
            assert.equal(classroomUpdated[2], "Science Building");
            assert.equal(classroomUpdated[3], 40);
        });

        it("should list created classrooms", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.createClassroom(["Room 201", "Science Building", 25]);
            await courseContract.write.createClassroom(["Room 301", "Math Building", 35]);
            // Act
            const result = await courseContract.read.listClassrooms() as any[];
            // Assert
            assert.isArray(result);
            assert.lengthOf(result, 3);
            assert.equal(result[0], 0);
            assert.equal(result[1], 1);
            assert.equal(result[2], 2);
        });

        it("should delete a classroom by id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            // Act
            const result = await courseContract.write.deleteClassroom([0]);
            const classroom = await courseContract.read.getClassroom([0]) as any[];
            // Assert
            assert.isFalse(classroom[4]);
        });
        
        it("should add a schedule with classroom assignment", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            // Act
            await courseContract.write.addSchedule([0, 1, 8, 10, 0]);
            const schedule = await courseContract.read.getSchedule([0, 1]) as any[];
            // Assert
            assert.equal(schedule[6], 0);
        });
        
        it("should update a schedule's classroom assignment", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.createClassroom(["Room 102", "Science Building", 25]);
            await courseContract.write.addSchedule([0, 1, 8, 10, 0]);
            
            // Act
            await courseContract.write.updateSchedule([0, 1, 1, 8, 10, 1]);
            const schedule = await courseContract.read.getSchedule([0, 1]) as any[];
            
            // Assert
            assert.equal(schedule[6], 1);
        });
        
        it("should assign a classroom to an existing schedule", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.createClassroom(["Room 102", "Science Building", 25]);
            await courseContract.write.addSchedule([0, 1, 8, 10, 0]);
            
            // Act
            await courseContract.write.assignClassroomToSchedule([0, 1, 1]);
            const schedule = await courseContract.read.getSchedule([0, 1]) as any[];
            
            // Assert
            assert.equal(schedule[6], 1);
        });
        
        it("should fail when creating a classroom without admin privileges", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.registerUser([client.account.address, 0]);
            
            // Act & Assert
            await expect(courseContract.write.createClassroom(
                ["Room 101", "Engineering Building", 30],
                { account: client.account.address }
            )).to.be.rejectedWith("Only administrators can create classrooms");
        });
        
        it("should fail when updating a classroom without admin privileges", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.registerUser([client.account.address, 0]);
            
            // Act & Assert
            await expect(courseContract.write.updateClassroom(
                [0, "Room 102", "Science Building", 40],
                { account: client.account.address }
            )).to.be.rejectedWith("Only administrators can update classrooms");
        });
        
        it("should fail when deleting a classroom without admin privileges", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.registerUser([client.account.address, 0]);
            
            // Act & Assert
            await expect(courseContract.write.deleteClassroom(
                [0],
                { account: client.account.address }
            )).to.be.rejectedWith("Only administrators can delete classrooms");
        });

    });

    describe("Requirement Validations", () => {
        it("should prevent registering an already registered user", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.registerUser([client.account.address, 0]);
            
            // Act & Assert
            await expect(courseContract.write.registerUser([client.account.address, 0]))
                .to.be.rejectedWith("User already registered");
        });
        
        it("should reject getting an invalid course ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            
            // Act & Assert
            await expect(courseContract.read.getCourse([999]))
                .to.be.rejectedWith("Invalid course ID");
        });
        
        it("should reject updating an invalid course ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            
            // Act & Assert
            await expect(courseContract.write.updateCourse([999, "Test", "Description", 3]))
                .to.be.rejectedWith("Invalid course ID");
        });
        
        it("should reject updating a deleted course", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            await courseContract.write.deleteCourse([0]);
            
            // Act & Assert
            await expect(courseContract.write.updateCourse([0, "Updated", "Updated desc", 3]))
                .to.be.rejectedWith("Course does not exist or has been deleted");
        });
        
        it("should reject deleting an invalid course ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            
            // Act & Assert
            await expect(courseContract.write.deleteCourse([999]))
                .to.be.rejectedWith("Invalid course ID");
        });
        
        it("should reject deleting an already deleted course", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            await courseContract.write.deleteCourse([0]);
            
            // Act & Assert
            await expect(courseContract.write.deleteCourse([0]))
                .to.be.rejectedWith("Course does not exist or has been deleted");
        });

        // Schedule validation tests
        it("should reject adding a schedule with invalid course ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            
            // Act & Assert
            await expect(courseContract.write.addSchedule([999, 1, 8, 10, 0]))
                .to.be.rejectedWith("Invalid course ID");
        });
        
        it("should reject adding a schedule to a deleted course", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.deleteCourse([0]);
            
            // Act & Assert
            await expect(courseContract.write.addSchedule([0, 1, 8, 10, 0]))
                .to.be.rejectedWith("Course does not exist or has been deleted");
        });
        
        it("should reject adding a schedule with invalid day", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            
            // Act & Assert - Day 0 (too low)
            await expect(courseContract.write.addSchedule([0, 0, 8, 10, 0]))
                .to.be.rejectedWith("Invalid day");
                
            // Day 8 (too high)
            await expect(courseContract.write.addSchedule([0, 8, 8, 10, 0]))
                .to.be.rejectedWith("Invalid day");
        });
        
        it("should reject adding a schedule with invalid hours", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            
            // Act & Assert - End hour before start hour
            await expect(courseContract.write.addSchedule([0, 1, 10, 8, 0]))
                .to.be.rejectedWith("Invalid schedule");
                
            // Hours out of range
            await expect(courseContract.write.addSchedule([0, 1, 8, 25, 0]))
                .to.be.rejectedWith("Invalid schedule");
        });
        
        it("should reject adding a schedule with invalid classroom ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            
            // Act & Assert
            await expect(courseContract.write.addSchedule([0, 1, 8, 10, 999]))
                .to.be.rejectedWith("Invalid classroom ID");
        });
        
        it("should reject adding a schedule with deleted classroom", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            await courseContract.write.createClassroom(["Room 101", "Engineering Building", 30]);
            await courseContract.write.deleteClassroom([0]);
            
            // Act & Assert
            await expect(courseContract.write.addSchedule([0, 1, 8, 10, 0]))
                .to.be.rejectedWith("Classroom does not exist or has been deleted");
        });
        
        it("should reject getting a schedule with invalid course ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            
            // Act & Assert
            await expect(courseContract.read.getSchedule([999, 1]))
                .to.be.rejectedWith("Invalid course ID");
        });
        
        it("should reject getting a schedule with invalid schedule ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            
            // Act & Assert
            await expect(courseContract.read.getSchedule([0, 999]))
                .to.be.rejectedWith("Invalid schedule ID");
        });
        
        it("should reject getting a schedule by ID with invalid ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            
            // Act & Assert
            await expect(courseContract.read.getScheduleById([999]))
                .to.be.rejectedWith("Invalid schedule ID");
        });
        
        // Student registration tests
        it("should reject non-students registering for courses", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            // Register as professor (role 1)
            await courseContract.write.registerUser([client.account.address, 1]);
            
            // Act & Assert
            await expect(courseContract.write.registerStudentInCourses(
                [[0n]],
                { account: client.account.address }
            )).to.be.rejectedWith("Only students can register in courses");
        });
        
        it("should reject registering for invalid course IDs", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.registerUser([client.account.address, 0]); // Register as student
            
            // Act & Assert
            await expect(courseContract.write.registerStudentInCourses(
                [[999n]],
                { account: client.account.address }
            )).to.be.rejectedWith("Invalid course ID");
        });
        
        it("should reject registering for deleted courses", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            await courseContract.write.deleteCourse([0]);
            await courseContract.write.registerUser([client.account.address, 0]); // Register as student
            
            // Act & Assert
            await expect(courseContract.write.registerStudentInCourses(
                [[0n]], 
                { account: client.account.address }
            )).to.be.rejectedWith("Course does not exist or has been deleted");
        });
        
        it("should reject duplicate course registrations", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Test", "Description", 3]);
            await courseContract.write.registerUser([client.account.address, 0]); // Register as student
            
            // First registration
            await courseContract.write.registerStudentInCourses(
                [[0n]],
                { account: client.account.address }
            );
            
            // Act & Assert - Second registration
            await expect(courseContract.write.registerStudentInCourses(
                [[0n]],
                { account: client.account.address }
            )).to.be.rejectedWith("Student already registered in one of the courses");
        });
        
        it("should reject getting courses for non-students", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            // Register as professor (role 1)
            await courseContract.write.registerUser([client.account.address, 1]);
            
            // Act & Assert
            await expect(courseContract.read.getStudentCourses({
                account: client.account.address
            })).to.be.rejectedWith("Only students can have enrolled courses");
        });
        
        it("should reject getting courses for unregistered users", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            
            // Act & Assert - User not registered
            await expect(courseContract.read.getStudentCourses({
                account: client.account.address
            })).to.be.rejectedWith("User not registered");
        });
        
        // Classroom tests
        it("should reject getting an invalid classroom ID", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            
            // Act & Assert
            await expect(courseContract.read.getClassroom([999]))
                .to.be.rejectedWith("Invalid classroom ID");
        });
    });
});