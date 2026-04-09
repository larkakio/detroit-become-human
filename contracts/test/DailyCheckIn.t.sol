// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DailyCheckIn} from "../src/DailyCheckIn.sol";

contract DailyCheckInTest is Test {
    DailyCheckIn public c;
    address public alice = address(0xA11ce);

    function setUp() public {
        c = new DailyCheckIn();
    }

    function test_FirstCheckIn_Succeeds() public {
        vm.prank(alice);
        c.checkIn();
        assertEq(c.streak(alice), 1);
        assertEq(c.lastDay(alice), block.timestamp / 1 days);
    }

    function test_SecondCheckInSameDay_Reverts() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.expectRevert(DailyCheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
        vm.stopPrank();
    }

    function test_NextDay_CheckIn_IncrementsStreak() public {
        vm.prank(alice);
        c.checkIn();
        uint256 day0 = block.timestamp / 1 days;
        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        c.checkIn();
        assertEq(c.streak(alice), 2);
        assertEq(c.lastDay(alice), day0 + 1);
    }

    function test_SkipDay_ResetsStreak() public {
        vm.prank(alice);
        c.checkIn();
        vm.warp(block.timestamp + 2 days);
        vm.prank(alice);
        c.checkIn();
        assertEq(c.streak(alice), 1);
    }

    function test_NonZeroValue_Reverts() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert(DailyCheckIn.ValueNotZero.selector);
        c.checkIn{value: 1 wei}();
    }
}
