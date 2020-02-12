/*******************************************************************************
 * Copyright (c) 2020 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
 *******************************************************************************/
package org.eclipse.winery.model.tosca.yaml.support;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

public abstract class ValueHelper {

    /**
     * Helper function to convert property, parameter, and attribute values to a string.
     */
    @SuppressWarnings("unchecked")
    public static String toString(Object value) {
        if (value == null) return "";
        if (value instanceof LinkedHashMap) {
            Map<String, Object> valueMap = (Map<String, Object>) value;
            Optional<Map.Entry<String, Object>> optionalEntry = valueMap.entrySet().stream().findFirst();
            if (optionalEntry.isPresent()) {
                Map.Entry<String, Object> entry = optionalEntry.get();
                return "{ " + entry.getKey() + ": " + entry.getValue().toString() + " }";
            }
        }
        return value.toString();
    }
}
