package threads;

import models.Booking;
import services.StorageManager;

public class PaymentSimulatorThread extends Thread {
    private final Booking booking;
    private boolean transactionStatus = false;

    public PaymentSimulatorThread(Booking booking) {
        this.booking = booking;
    }

    public boolean getTransactionStatus() { return transactionStatus; }

    @Override
    public void run() {
        try {
            System.out.println("[THREAD-" + Thread.currentThread().getId() + "] Initiating Secure Gateway Authorization for Booking ID: " + booking.getBookingId());
            
            // Simulating network latency for authorization
            Thread.sleep(1000);
            
            System.out.println("[THREAD-" + Thread.currentThread().getId() + "] Authorization SECURED. Finalizing dual-write transaction...");
            
            // Finalize the booking using the StorageManager
            StorageManager.getInstance().persistBooking(booking);
            this.transactionStatus = true;
            
            System.out.println("[THREAD-" + Thread.currentThread().getId() + "] Transaction COMPLETED. Passenger notified via Celestial Pulse.");
            
        } catch (InterruptedException e) {
            System.err.println("[THREAD-ERR] Payment Thread Interrupted: " + e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}
