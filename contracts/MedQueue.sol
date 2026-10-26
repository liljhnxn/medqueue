// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedQueue
 * @dev A simple, lightweight hospital queue registration demo running on Botchain Mainnet.
 * Assigns sequential queue numbers starting from 1 to registering wallets.
 * No medical or personal data is collected or stored.
 */
contract MedQueue {
    struct Registration {
        uint256 queueNumber;
        uint256 timestamp;
        bool isRegistered;
    }

    // Mapping from wallet address to registration details
    mapping(address => Registration) private registrations;

    // Total count of registrations
    uint256 public totalRegistrations;

    // Event emitted when a wallet registers for the queue
    event PatientRegistered(
        address indexed patient,
        uint256 queueNumber,
        uint256 timestamp
    );

    /**
     * @dev Register the caller's wallet for a queue number.
     * Each wallet can register only once.
     * Queue numbers start from 1 and increment sequentially.
     */
    function registerForQueue() external {
        require(!registrations[msg.sender].isRegistered, "Already registered");

        totalRegistrations++;
        uint256 assignedNumber = totalRegistrations;
        uint256 regTimestamp = block.timestamp;

        registrations[msg.sender] = Registration({
            queueNumber: assignedNumber,
            timestamp: regTimestamp,
            isRegistered: true
        });

        emit PatientRegistered(msg.sender, assignedNumber, regTimestamp);
    }

    /**
     * @dev Retrieve the queue number for a given wallet address.
     * Returns 0 if the wallet has not registered.
     */
    function getQueueNumber(address patient) external view returns (uint256) {
        return registrations[patient].queueNumber;
    }

    /**
     * @dev Check whether a given wallet address has registered.
     */
    function isRegistered(address patient) external view returns (bool) {
        return registrations[patient].isRegistered;
    }

    /**
     * @dev Retrieve the registration timestamp for a given wallet address.
     * Returns 0 if the wallet has not registered.
     */
    function getRegistrationTimestamp(address patient) external view returns (uint256) {
        return registrations[patient].timestamp;
    }

    /**
     * @dev Convenient helper function to fetch all queue information for a wallet in a single call.
     */
    function getPatientQueueInfo(address patient)
        external
        view
        returns (
            bool registered,
            uint256 queueNumber,
            uint256 timestamp
        )
    {
        Registration memory reg = registrations[patient];
        return (reg.isRegistered, reg.queueNumber, reg.timestamp);
    }

    /**
     * @dev Retrieve the current queue status for a given wallet address.
     * Returns "Waiting" if registered, or "Not registered" if not registered.
     */
    function getQueueStatus(address patient) external view returns (string memory) {
        if (registrations[patient].isRegistered) {
            return "Waiting";
        }
        return "Not registered";
    }
}
