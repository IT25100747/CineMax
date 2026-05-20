package com.we24.cinemax.model;

import lombok.Data;
import java.util.List;

@Data
public class UpdateSeatsRequest {
    private List<String> newSeats;
}
