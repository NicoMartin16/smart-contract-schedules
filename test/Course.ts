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
            // Act
            await courseContract.write.addSchedule([0, 1, 8, 10]);
            const course = await courseContract.read.getCourse([0]) as any[];
            // Assert
            assert.equal(course[4], 1);
        });

        it("should get a schedule by schedule id", async () => {
            // Arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.addSchedule([0, 1, 8, 10]);
            // Act
            const result = await courseContract.read.getScheduleById([0]) as any[];
            // Assert
            expect(result[0]).to.equal(0n);
            expect(result[1]).to.equal(1);
            expect(result[2]).to.equal(8);
            expect(result[3]).to.equal(10);
        });

        it("should register a student to a course", async ( ) => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.createCourse(["Vector Calculus", "Study the principles of vector calculus", 3]);
            await courseContract.write.createCourse(["Advanced Calculus", "Study the principles of advanced calculus", 3]);
            await courseContract.write.createCourse(["Algorithms", "Study the principles of algorithms", 3]);
            await courseContract.write.createCourse(["Data Structures", "Study the principles of data structures", 3]);

            await courseContract.write.registerUser([client.account.address, 0]);
            // Act
            await courseContract.write.registerStudentInCourse([0], {
                account: client.account.address,
            });
            await courseContract.write.registerStudentInCourse([1], {
                account: client.account.address,
            });
            await courseContract.write.registerStudentInCourse([2], {
                account: client.account.address,
            });
            await courseContract.write.registerStudentInCourse([3], {
                account: client.account.address,
            });
            await courseContract.write.registerStudentInCourse([4], {
                account: client.account.address,
            });
            const result = await courseContract.read.getStudentCourses({
                account: client.account.address,
            }) as any[];

            // Assert
            assert.isArray(result);
            assert.lengthOf(result, 5);
            assert.equal(result[0], 0);
        });

        it("should list all schedules", async () => {
            // arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.addSchedule([0, 1, 8, 10]);
            await courseContract.write.addSchedule([0, 2, 8, 10]);
            await courseContract.write.addSchedule([0, 3, 8, 10]);
            await courseContract.write.addSchedule([0, 1, 6, 8]);
            const result = await courseContract.read.listAllSchedules() as any[];

            assert.isArray(result);
            assert.lengthOf(result, 4);
        });
        
        it("should update data from a schedule", async () => {
            // arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.addSchedule([0, 1, 8, 10]);
            const result = await courseContract.write.updateSchedule([0, 1, 1, 6, 8]);
            const schedule = await courseContract.read.getSchedule([0, 1]) as any[];

            assert.ok(result);
            assert.equal(schedule[2], 6);
            assert.equal(schedule[3], 8);
        });

        it("should delete a schedule", async () => {
            // arrange
            const { courseContract } = await loadFixture(deployCourseManagementContractFixture);

            // Act
            await courseContract.write.createCourse(["Differential Calculus", "Study the principles of differential calculus", 3]);
            await courseContract.write.addSchedule([0, 1, 8, 10]);
            const result = await courseContract.write.deleteSchedule([0, 1]);
            const schedule = await courseContract.read.getSchedule([0, 1]) as any[];
            // assert
            assert.isFalse(schedule[5]);
        });

        it("should return if a user is registered in contract", async () => {

            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.registerUser([client.account.address, 0]);
            // Act
            const result = await courseContract.read.isRegistered([client.account.address]) as any[];
            // Assert
            assert.isTrue(result);

        });

        it("should return user", async () => {
            // Arrange
            const { courseContract, client } = await loadFixture(deployCourseManagementContractFixture);
            await courseContract.write.registerUser([client.account.address, 0]);
            // Act
            const result = await courseContract.read.getUser([client.account.address]) as any;
            // Assert
            assert.equal(result.addr, client.account.address);
            assert.equal(result.role, 0);
            assert.isTrue(result.isActive);
        })

    });
});