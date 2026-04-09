// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice One check-in per UTC day (`block.timestamp / 1 days`). No ETH accepted.
/// @dev `lastDayEnc` stores `day + 1`, or `0` if the user has never checked in (avoids day 0 ambiguity).
contract DailyCheckIn {
    mapping(address => uint256) public lastDayEnc;
    mapping(address => uint256) public streak;

    error ValueNotZero();
    error AlreadyCheckedInToday();

    event CheckedIn(address indexed user, uint256 day, uint256 streak);

    /// @return The user's last check-in day index, same as `block.timestamp / 1 days` at that time.
    function lastDay(address user) external view returns (uint256) {
        uint256 enc = lastDayEnc[user];
        return enc == 0 ? 0 : enc - 1;
    }

    function checkIn() external payable {
        if (msg.value != 0) revert ValueNotZero();

        uint256 day = block.timestamp / 1 days;
        uint256 enc = lastDayEnc[msg.sender];

        if (enc != 0) {
            uint256 lastRecordedDay = enc - 1;
            if (lastRecordedDay == day) revert AlreadyCheckedInToday();
        }

        uint256 prevDay = enc == 0 ? type(uint256).max : enc - 1;

        uint256 newStreak;
        if (enc == 0) {
            newStreak = 1;
        } else if (day == prevDay + 1) {
            newStreak = streak[msg.sender] + 1;
        } else {
            newStreak = 1;
        }

        lastDayEnc[msg.sender] = day + 1;
        streak[msg.sender] = newStreak;

        emit CheckedIn(msg.sender, day, newStreak);
    }
}
